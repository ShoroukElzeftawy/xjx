import { NextResponse } from "next/server";
import { fetchCatalog } from "../../lib/shopify";

export async function GET() {
  try {
    return NextResponse.json(await fetchCatalog());
  } catch (error) {
    return NextResponse.json({
      connected: false,
      reason: error instanceof Error ? error.message : "Shopify unavailable",
    });
  }
}
