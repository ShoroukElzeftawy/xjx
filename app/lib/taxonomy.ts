export const PRODUCT_TYPES = ["EARRINGS", "BRACELETS", "RINGS", "NECKLACES", "CHAINS"] as const;
export const SHOP_TYPES = ["EARRINGS", "BRACELETS", "RINGS", "NECKLACES"] as const;
export const PRODUCT_COLORS = ["YELLOW", "WHITE", "PINK"] as const;
export const COMING_TYPES = ["BRACELETS", "RINGS", "NECKLACES", "CHAINS"] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];
export type ProductColor = (typeof PRODUCT_COLORS)[number];

const typeHints: [RegExp, ProductType][] = [
  [/earring|hoop/i, "EARRINGS"],
  [/bracelet|bangle/i, "BRACELETS"],
  [/\brings?\b/i, "RINGS"],
  [/chain/i, "CHAINS"],
  [/necklace|pendant|choker/i, "NECKLACES"],
];

export function inferType(source: string, fallback: ProductType = "NECKLACES"): ProductType {
  const match = typeHints.find(([pattern]) => pattern.test(source));
  if (match) return match[1];
  const upper = source.trim().toUpperCase();
  return (PRODUCT_TYPES as readonly string[]).includes(upper) ? (upper as ProductType) : fallback;
}

export function inferColor(source: string, fallback: ProductColor = "YELLOW"): ProductColor {
  if (/white|wg\b|white gold/i.test(source)) return "WHITE";
  if (/pink|rose/i.test(source)) return "PINK";
  if (/yellow|yg\b|yellow gold/i.test(source)) return "YELLOW";
  return fallback;
}

export function toneForColor(color: ProductColor) {
  if (color === "WHITE") return "silver";
  if (color === "PINK") return "blue";
  return "gold";
}
