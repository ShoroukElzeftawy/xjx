export const PRODUCT_TYPES = ["EARRINGS", "BRACELETS", "RINGS", "PENDANTS", "CHAINS"] as const;
export const SHOP_TYPES = ["EARRINGS", "BRACELETS", "RINGS", "PENDANTS", "CHAINS"] as const;
export const PRODUCT_COLORS = ["YELLOW", "WHITE", "PINK"] as const;
export const COMING_TYPES = ["RINGS", "PENDANTS"] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];
export type ProductColor = (typeof PRODUCT_COLORS)[number];

const TYPE_ALIASES: Record<string, ProductType> = {
  NECKLACES: "PENDANTS",
  NECKLACE: "PENDANTS",
};

const typeHints: [RegExp, ProductType][] = [
  [/\bxj3[\s-]|bracelet|bangle/i, "BRACELETS"],
  [/\bxj4[\s-]|earring/i, "EARRINGS"],
  [/\bxj2[\s-]|\brings?\b/i, "RINGS"],
  [/\bxj1[\s-]|chain/i, "CHAINS"],
  [/\bxj5[\s-]|necklace|pendant|choker/i, "PENDANTS"],
  [/hoop/i, "EARRINGS"],
];

export function inferType(source: string, fallback: ProductType = "PENDANTS"): ProductType {
  const match = typeHints.find(([pattern]) => pattern.test(source));
  if (match) return match[1];
  const upper = source.trim().toUpperCase();
  if (TYPE_ALIASES[upper]) return TYPE_ALIASES[upper];
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
