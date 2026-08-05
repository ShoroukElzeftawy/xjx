import { NextResponse } from "next/server";

const domain = process.env.SHOPIFY_STORE_DOMAIN || "xjewelryx-2.myshopify.com";
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

const query = `query XJXCatalog {
  products(first: 100) {
    nodes {
      id title handle productType
      featuredImage { url altText }
      priceRange { minVariantPrice { amount currencyCode } }
      collections(first: 5) { nodes { title handle } }
    }
  }
  collections(first: 50) { nodes { title handle } }
}`;

export async function GET() {
  const response = await fetch(`https://${domain}/api/2026-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-Shopify-Storefront-Access-Token": token } : {}),
    },
    body: JSON.stringify({ query }),
  });

  const payload = await response.json() as any;
  if (!response.ok || payload.errors) {
    return NextResponse.json({ connected: false, reason: payload.errors?.[0]?.message || "Shopify unavailable" }, { status: 200 });
  }

  const money = new Intl.NumberFormat("en", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const products = payload.data.products.nodes.map((item: any, index: number) => {
    const collection = item.collections.nodes[0]?.title || item.productType || "OBJECTS";
    return {
      name: item.title,
      price: money.format(Number(item.priceRange.minVariantPrice.amount)),
      type: collection.toUpperCase(),
      tone: ["silver", "blue", "gold", "dark"][index % 4],
      code: `XJX-${String(index + 1).padStart(3, "0")}`,
      image: item.featuredImage?.url,
      handle: item.handle,
    };
  });
  const collections = payload.data.collections.nodes.map((item: any) => item.title.toUpperCase());
  return NextResponse.json({ connected: true, products, collections });
}
