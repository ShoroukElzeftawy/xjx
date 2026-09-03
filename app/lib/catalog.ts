import { skuFor } from "./copy";
import type { ProductItem } from "./types";

export const fallbackProducts: ProductItem[] = [
  {
    name: "10KT Yellow Gold Thick Hoop Earrings",
    price: "$0.00 CAD",
    type: "EARRINGS",
    color: "YELLOW",
    tone: "gold",
    code: skuFor("EARRINGS", 1),
    sku: "XJ4–01",
    karat: "10KT",
    handle: "xj4-10kt-thick-earrings",
    options: "1.67G",
    sizeCompare: "About as wide as a US dime. Sits on the lobe like a thick gold ring — not a thin wire hoop.",
    description: "A solid 10KT yellow gold hoop with weight you can feel. Made for daily wear, sized by comparison, not only millimeters.",
    image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/1.67g_Model_1_800x800.jpg?v=1785932912",
    images: [
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/1.67g_Model_1_800x800.jpg?v=1785932912",
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/1.67g_Product_2_800x800.png?v=1785932912",
    ],
  },
  {
    name: "10KT White Gold Thick Hoop Earrings",
    price: "$0.00 CAD",
    type: "EARRINGS",
    color: "WHITE",
    tone: "silver",
    code: skuFor("EARRINGS", 2),
    sku: "XJ4–02",
    karat: "10KT",
    handle: "xj4-10kt-white-gold-thick-hoop",
    options: "2.35G / 3.15G",
    sizeCompare: "A touch larger than a dime across. The white gold reads cooler on skin; the hoop still has the same thick, stacked presence.",
    description: "The same thick hoop form in 10KT white gold. Two weights, so you can choose how substantial it feels on the ear.",
    image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/2.35g_Model_1_800x800.jpg?v=1785932003",
    images: [
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/2.35g_Model_1_800x800.jpg?v=1785932003",
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/3.15g_Product_2_800x800.jpg?v=1785932045",
    ],
  },
  {
    name: "10KT Yellow Gold Versace Thick Hoops",
    price: "$0.00 CAD",
    type: "EARRINGS",
    color: "YELLOW",
    tone: "gold",
    code: skuFor("EARRINGS", 3),
    sku: "XJ4–03",
    karat: "10KT",
    handle: "xj4-10kt-versace-thick-earrings",
    options: "5.31G",
    sizeCompare: "Faces about as wide as a bottle cap. Heavier than a house key — you will feel these when you turn your head.",
    description: "A patterned 10KT yellow gold hoop with real mass. The motif is cut into the metal, not stamped on as decoration.",
    image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/5.31g_Model_1_b0fcc55f-e41f-4462-9d44-69fdae394b27_800x800.jpg?v=1785930967",
    images: [
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/5.31g_Model_1_b0fcc55f-e41f-4462-9d44-69fdae394b27_800x800.jpg?v=1785930967",
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/5.31g_Product_1_3ad0f463-e817-4762-b4d6-e55751d56ffd_800x800.jpg?v=1785930967",
    ],
  },
  {
    name: "10KT Yellow Gold Versace Thin Hoops",
    price: "$0.00 CAD",
    type: "EARRINGS",
    color: "YELLOW",
    tone: "gold",
    code: skuFor("EARRINGS", 4),
    sku: "XJ4–04",
    karat: "10KT",
    handle: "xj4-10kt-versace-thin-earrings",
    options: "4 WEIGHTS",
    sizeCompare: "Closer to a coin edge than a statement hoop. Think the thickness of a pencil, not a cigar band.",
    description: "The same Versace cut in a thinner profile. Four weights so the scale can match the ear, not a generic medium.",
    image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/Model_1_800x800.jpg?v=1785929002",
    images: [
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/Model_1_800x800.jpg?v=1785929002",
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/3.13g_Product_1_800x800.jpg?v=1785930155",
    ],
  },
  {
    name: "18KT Yellow Gold Gucci Chain",
    price: "$0.00 CAD",
    type: "CHAINS",
    color: "YELLOW",
    tone: "gold",
    listed: false,
    code: skuFor("CHAINS", 1),
    sku: "XJ1–01",
    karat: "18KT",
    handle: "18kt-gucci-4mm-4-5mm-6mm-8mm",
    options: "4MM / 4.5MM / 6MM / 8MM",
    sizeCompare: "Widths from a coffee stirrer to a pencil. Length is fitted against a chain you already wear, not a tape alone.",
    description: "Held back until this family is split by type, color, width, length, and hollow or filled.",
    image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/13_800x800.png?v=1777473725",
    images: [
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/13_800x800.png?v=1777473725",
      "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/7_800x800.png?v=1777473725",
    ],
  },
];

export const shopifyStoreUrl = "https://xjewelryx-2.myshopify.com";

export function isShopListed(item: ProductItem) {
  return item.listed !== false;
}

export function shopProducts(catalog: ProductItem[]) {
  return catalog.filter(isShopListed);
}

export function productUrl(handle?: string) {
  return handle ? `${shopifyStoreUrl}/products/${handle}` : shopifyStoreUrl;
}
