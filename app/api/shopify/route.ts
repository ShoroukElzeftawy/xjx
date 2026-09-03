import { NextResponse } from "next/server";
import { fetchCatalog } from "../../lib/shopify";

function buyerIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || undefined;
}

export async function GET(request: Request) {
  try {
    return NextResponse.json(await fetchCatalog(buyerIp(request)));
  } catch (error) {
    return NextResponse.json({
      connected: false,
      reason: error instanceof Error ? error.message : "Shopify unavailable",
    });
  }
}
