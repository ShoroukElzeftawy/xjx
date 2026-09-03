import { NextResponse } from "next/server";
import { createCheckout, variantPermalink } from "../../../lib/shopify";

function buyerIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || undefined;
}

export async function POST(request: Request) {
  const body = await request.json() as { lines?: { merchandiseId: string; quantity?: number }[] };
  const lines = (body.lines ?? [])
    .filter((line) => line.merchandiseId)
    .map((line) => ({ merchandiseId: line.merchandiseId, quantity: line.quantity ?? 1 }));

  if (!lines.length) {
    return NextResponse.json({ error: "No items to check out" }, { status: 400 });
  }

  try {
    const cart = await createCheckout(lines, buyerIp(request));
    return NextResponse.json({ checkoutUrl: cart.checkoutUrl, quantity: cart.totalQuantity });
  } catch (error) {
    return NextResponse.json({
      checkoutUrl: variantPermalink(lines[0].merchandiseId, lines[0].quantity),
      reason: error instanceof Error ? error.message : "Using Shopify cart permalink",
    });
  }
}
