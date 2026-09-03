import type { ProductItem } from "./types";

export const fallbackProducts: ProductItem[] = [
  {
    name: "XJ4 — 10KT Thick Earrings",
    price: "$0.00 CAD",
    type: "EARRINGS",
    tone: "silver",
    code: "XJ4–01",
    handle: "xj4-10kt-thick-earrings",
    options: "1.67G",
    image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/1.67g_Model_1_800x800.jpg?v=1785932912",
    images: [
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/1.67g_Model_1_800x800.jpg?v=1785932912",
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/1.67g_Product_2_800x800.png?v=1785932912",
    ],
  },
  {
    name: "XJ4 — 10KT White Gold Thick Hoop",
    price: "$0.00 CAD",
    type: "EARRINGS",
    tone: "silver",
    code: "XJ4–02",
    handle: "xj4-10kt-white-gold-thick-hoop",
    options: "2.35G / 3.15G",
    image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/2.35g_Model_1_800x800.jpg?v=1785932003",
    images: [
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/2.35g_Model_1_800x800.jpg?v=1785932003",
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/3.15g_Product_2_800x800.jpg?v=1785932045",
    ],
  },
  {
    name: "XJ4 — 10KT Versace Thick Earrings",
    price: "$0.00 CAD",
    type: "EARRINGS",
    tone: "gold",
    code: "XJ4–03",
    handle: "xj4-10kt-versace-thick-earrings",
    options: "5.31G",
    image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/5.31g_Model_1_b0fcc55f-e41f-4462-9d44-69fdae394b27_800x800.jpg?v=1785930967",
    images: [
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/5.31g_Model_1_b0fcc55f-e41f-4462-9d44-69fdae394b27_800x800.jpg?v=1785930967",
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/5.31g_Product_1_3ad0f463-e817-4762-b4d6-f55751d56ffd_800x800.jpg?v=1785930967",
    ],
  },
  {
    name: "XJ4 — 10KT Versace Thin Earrings",
    price: "$0.00 CAD",
    type: "EARRINGS",
    tone: "gold",
    code: "XJ4–04",
    handle: "xj4-10kt-versace-thin-earrings",
    options: "4 WEIGHTS",
    image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/Model_1_800x800.jpg?v=1785929002",
    images: [
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/Model_1_800x800.jpg?v=1785929002",
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/3.13g_Product_1_800x800.jpg?v=1785930155",
    ],
  },
  {
    name: "18KT Gucci Chain",
    price: "$0.00 CAD",
    type: "NECKLACES",
    tone: "gold",
    code: "XJ1–01",
    handle: "18kt-gucci-4mm-4-5mm-6mm-8mm",
    options: "4MM / 4.5MM / 6MM / 8MM",
    image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/13_800x800.png?v=1777473725",
    images: [
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/13_800x800.png?v=1777473725",
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/7_800x800.png?v=1777473725",
    ],
  },
];

export const fallbackCollections = ["EARRINGS", "NECKLACES"];
export const shopifyStoreUrl = "https://xjewelryx-2.myshopify.com";

export function productUrl(handle?: string) {
  return handle ? `${shopifyStoreUrl}/products/${handle}` : shopifyStoreUrl;
}
