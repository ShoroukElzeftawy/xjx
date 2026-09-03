import { inferColor, inferType, toneForColor } from "./taxonomy";
import type { ProductItem } from "./types";

export const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN || "xjewelryx-2.myshopify.com";
export const shopifyToken = process.env.SHOPIFY_STOREFRONT_TOKEN;
const endpoint = `https://${shopifyDomain}/api/2026-07/graphql.json`;

type Money = { amount: string; currencyCode: string };
type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  productType?: string;
  featuredImage?: { url: string } | null;
  images?: { nodes: { url: string }[] };
  options?: { name: string; values: string[] }[];
  variants?: {
    nodes: {
      id: string;
      title: string;
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

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(shopifyToken ? { "X-Shopify-Storefront-Access-Token": shopifyToken } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const payload = await response.json() as { data?: T; errors?: { message: string }[] };
  if (!response.ok || payload.errors) {
    throw new Error(payload.errors?.[0]?.message || "Shopify unavailable");
  }
  return payload.data as T;
}

const catalogQuery = `query XJXCatalog {
  products(first: 100) {
    nodes {
      id title handle description productType
      featuredImage { url }
      images(first: 8) { nodes { url } }
      options { name values }
      variants(first: 50) {
        nodes {
          id title availableForSale
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
  return {
    name: item.title,
    price: money(price),
    type,
    color,
    tone: toneForColor(color),
    code: `XJX-${String(index + 1).padStart(3, "0")}`,
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
    })),
    description: item.description || undefined,
  };
}

export async function fetchCatalog() {
  const data = await shopifyFetch<{
    products: { nodes: ShopifyProduct[] };
    collections: { nodes: { title: string }[] };
  }>(catalogQuery);
  return {
    connected: true,
    products: data.products.nodes.map(mapProduct),
    collections: data.collections.nodes.map((item) => item.title.toUpperCase()),
  };
}

export async function createCheckout(lines: { merchandiseId: string; quantity: number }[]) {
  const data = await shopifyFetch<{
    cartCreate: { cart?: { checkoutUrl: string; totalQuantity: number }; userErrors: { message: string }[] };
  }>(`mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl totalQuantity }
      userErrors { message }
    }
  }`, { lines });

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
