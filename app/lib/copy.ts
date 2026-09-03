export const SLOGAN = "WE CUT THE FLUFF";

export const familyCode: Record<string, string> = {
  CHAINS: "XJ1",
  RINGS: "XJ2",
  BRACELETS: "XJ3",
  EARRINGS: "XJ4",
  NECKLACES: "XJ5",
};

export function skuFor(type: string, itemNumber: number) {
  const family = familyCode[type] || "XJX";
  return `${family}–${String(itemNumber).padStart(2, "0")}`;
}
