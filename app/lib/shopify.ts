import { skuFor } from "./copy";
import { inferColor, inferType, toneForColor } from "./taxonomy";
import type { ProductItem } from "./types";

export const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN || "xjewelryx-2.myshopify.com";
export const shopifyToken = process.env.SHOPIFY_STOREFRONT_TOKEN?.trim();
const apiVersions = ["2025-01", "2025-10", "2024-10", "2026-07"];

type Money = { amount: string; currencyCode: string };
type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  productType?: string;
  vendor?: string;
  tags?: string[];
  featuredImage?: { url: string } | null;
  images?: { nodes: { url: string }[] };
  options?: { name: string; values: string[] }[];
  variants?: {
    nodes: {
      id: string;
      title: string;
      sku?: string;
      availableForSale: boolean;
      price: Money;
      selectedOptions?: { name: string; value: string }[];
    }[];
  };
  priceRange?: { minVariantPrice: Money };
  collections?: { nodes: { title: string }[] };
};

function money(value: Money) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: value.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(value.amount));
}

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  buyerIp?: string,
) {
  if (!shopifyToken) {
    throw new Error(
      "Missing SHOPIFY_STOREFRONT_TOKEN. Log into Shopify Admin, create a custom app with Storefront API access, then put the token in .env.local. Do not put the Admin email or password in this project.",
    );
  }

  let lastError = "Shopify unavailable";
  const headerSets: Record<string, string>[] = [
    { "X-Shopify-Storefront-Access-Token": shopifyToken },
  ];
  if (shopifyToken.startsWith("shpss_")) {
    headerSets.push({
      "Shopify-Storefront-Private-Token": shopifyToken,
      "Shopify-Storefront-Buyer-IP": buyerIp || "127.0.0.1",
    });
  }

  for (const version of apiVersions) {
    for (const auth of headerSets) {
      const response = await fetch(`https://${shopifyDomain}/api/${version}/graphql.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ query, variables }),
        cache: "no-store",
      });
      const text = await response.text();
      let payload: { data?: T; errors?: { message: string }[] } = {};
      try {
        payload = JSON.parse(text) as { data?: T; errors?: { message: string }[] };
      } catch {
        lastError = `Shopify ${response.status}`;
        continue;
      }
      if (response.ok && payload.data && !payload.errors) {
        return payload.data;
      }
      lastError = payload.errors?.[0]?.message || `Shopify ${response.status}`;
      if (response.status === 404) break;
    }
  }

  throw new Error(lastError);
}

const catalogQuery = `query XJXCatalog {
  products(first: 100) {
    nodes {
      id title handle description productType vendor tags
      featuredImage { url }
      images(first: 8) { nodes { url } }
      options { name values }
      variants(first: 50) {
        nodes {
          id title sku availableForSale
          price { amount currencyCode }
          selectedOptions { name value }
        }
      }
      priceRange { minVariantPrice { amount currencyCode } }
      collections(first: 5) { nodes { title } }
    }
  }
  collections(first: 50) { nodes { title } }
}`;

export function mapProduct(item: ShopifyProduct, index: number): ProductItem {
  const variants = item.variants?.nodes ?? [];
  const images = item.images?.nodes.map((image) => image.url) ?? [];
  const optionValues = item.options?.flatMap((option) => option.values) ?? [];
  const source = [item.productType, item.title, optionValues.join(" ")].filter(Boolean).join(" ");
  const type = inferType(source, inferType(item.productType || "", "NECKLACES"));
  const color = inferColor(source);
  const price = variants[0]?.price ?? item.priceRange?.minVariantPrice ?? { amount: "0", currencyCode: "USD" };
  const sku = variants[0]?.sku || skuFor(type, index + 1);
  const karat = item.title.match(/\b(\d{1,2}\s?KT)\b/i)?.[1]?.replace(/\s+/g, "").toUpperCase();
  return {
    name: item.title,
    price: money(price),
    type,
    color,
    tone: toneForColor(color),
    listed: true,
    code: sku,
    sku,
    karat,
    image: item.featuredImage?.url ?? images[0],
    images: images.length ? images : item.featuredImage?.url ? [item.featuredImage.url] : [],
    handle: item.handle,
    options: optionValues.slice(0, 6).join(" / ") || variants[0]?.title,
    optionValues,
    variantId: variants[0]?.id,
    variants: variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      price: money(variant.price),
      available: variant.availableForSale,
      sku: variant.sku,
    })),
    description: item.description || undefined,
    vendor: item.vendor,
    tags: item.tags,
  };
}

export async function fetchCatalog(buyerIp?: string) {
  const data = await shopifyFetch<{
    products: { nodes: ShopifyProduct[] };
    collections: { nodes: { title: string }[] };
  }>(catalogQuery, undefined, buyerIp);
  const counts: Record<string, number> = {};
  return {
    connected: true,
    products: data.products.nodes.map((item, index) => {
      const mapped = mapProduct(item, index);
      counts[mapped.type] = (counts[mapped.type] ?? 0) + 1;
      const generated = skuFor(mapped.type, counts[mapped.type]);
      const sku = mapped.sku || generated;
      return { ...mapped, code: sku, sku };
    }),
    collections: data.collections.nodes.map((item) => item.title.toUpperCase()),
  };
}

export async function createCheckout(
  lines: { merchandiseId: string; quantity: number }[],
  buyerIp?: string,
) {
  const data = await shopifyFetch<{
    cartCreate: { cart?: { checkoutUrl: string; totalQuantity: number }; userErrors: { message: string }[] };
  }>(`mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl totalQuantity }
      userErrors { message }
    }
  }`, { lines }, buyerIp);

  const error = data.cartCreate.userErrors[0]?.message;
  if (error || !data.cartCreate.cart?.checkoutUrl) {
    throw new Error(error || "Could not create checkout");
  }
  return data.cartCreate.cart;
}

export function variantPermalink(variantId: string, quantity = 1) {
  const numeric = variantId.split("/").pop();
  return numeric ? `https://${shopifyDomain}/cart/${numeric}:${quantity}` : `https://${shopifyDomain}`;
}
