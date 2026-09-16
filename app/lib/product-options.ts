import { inferColor, PRODUCT_COLORS, type ProductColor } from "./taxonomy";
import type { ProductItem, ProductVariant } from "./types";

export type ProductOption = {
  id: string;
  label: string;
  price?: string;
  variantId?: string;
  image?: string;
  color?: ProductColor;
};

function optionLabel(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

function isPlaceholderTitle(title: string) {
  return !title || /default title/i.test(title);
}

export function stripColorFromLabel(raw: string) {
  return optionLabel(raw)
    .replace(/\s*\/\s*(yellow|white|pink|rose)\s*gold/gi, "")
    .replace(/\b(yellow|white|pink|rose)\s*gold\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*\/\s*$/g, "")
    .trim();
}

export function colorFromText(source: string): ProductColor | undefined {
  if (!source) return undefined;
  if (/white|wg\b/i.test(source)) return "WHITE";
  if (/pink|rose/i.test(source)) return "PINK";
  if (/yellow|yg\b/i.test(source)) return "YELLOW";
  return undefined;
}

export type VariantAxes = {
  color: ProductColor;
  weight: string;
  profile: string;
};

function usableVariants(item: ProductItem) {
  return (item.variants ?? []).filter((variant) => !isPlaceholderTitle(optionLabel(variant.title || "")));
}

function variantBlob(variant?: ProductVariant) {
  const options = (variant?.selectedOptions ?? []).map((entry) => entry.value).join(" ");
  return [variant?.title, options].filter(Boolean).join(" ");
}

function gramToken(value: string) {
  const match = value.toLowerCase().replace(/,/g, ".").match(/(\d+(?:\.\d+)?)\s*g\b/);
  return match ? `${match[1]}g` : "";
}

export function parseAxes(item: ProductItem, variant?: ProductVariant): VariantAxes {
  const blob = variantBlob(variant);
  const weight = gramToken(blob);
  const profile = /thick/i.test(blob) ? "Thick" : /thin/i.test(blob) ? "Thin" : "";
  const color = colorFromText(blob) ?? inferColor(item.color || "", "YELLOW");
  return { color, weight, profile };
}

export function uniqueAxes(item: ProductItem) {
  const parsed = (item.variants ?? []).map((variant) => parseAxes(item, variant));
  const fromVariants = PRODUCT_COLORS.filter((color) => parsed.some((entry) => entry.color === color));
  const colors = fromVariants.length
    ? fromVariants
    : [inferColor([item.color, item.name, item.handle].filter(Boolean).join(" "), "YELLOW")];
  const weights = [...new Set(parsed.map((entry) => entry.weight).filter(Boolean))].sort(
    (a, b) => Number.parseFloat(a) - Number.parseFloat(b),
  );
  const profiles = ["Thin", "Thick"].filter((profile) => parsed.some((entry) => entry.profile === profile));
  return { colors, weights, profiles };
}

export function comboExists(item: ProductItem, wanted: Partial<VariantAxes>) {
  const pool = (item.variants ?? []).length ? item.variants ?? [] : [];
  return pool.some((variant) => {
    const axes = parseAxes(item, variant);
    return (Object.keys(wanted) as (keyof VariantAxes)[]).every((key) => !wanted[key] || axes[key] === wanted[key]);
  });
}

export function matchVariant(item: ProductItem, next: Partial<VariantAxes>, current?: ProductVariant) {
  const variants = usableVariants(item);
  const base = parseAxes(item, current);
  const wanted: VariantAxes = {
    color: next.color ?? base.color,
    weight: next.weight ?? base.weight,
    profile: next.profile ?? base.profile,
  };

  const find = (keys: (keyof VariantAxes)[]) =>
    variants.find((variant) => {
      const axes = parseAxes(item, variant);
      return keys.every((key) => !wanted[key] || axes[key] === wanted[key]);
    });

  return (
    find(["color", "weight", "profile"]) ||
    (next.profile ? find(["color", "profile"]) || find(["profile"]) : undefined) ||
    (next.weight ? find(["color", "weight"]) || find(["weight"]) : undefined) ||
    (next.color ? find(["color"]) : undefined) ||
    find(["color", "profile"]) ||
    find(["color", "weight"]) ||
    current ||
    variants[0]
  );
}

export function variantColor(item: ProductItem, variant?: ProductVariant): ProductColor {
  return parseAxes(item, variant).color;
}

export function productColors(item: ProductItem): ProductColor[] {
  const { colors } = uniqueAxes(item);
  if (colors.length) return colors;
  return item.color ? [inferColor(item.color, "YELLOW")] : [];
}

export function axesLabel(item: ProductItem, variant?: ProductVariant) {
  const { weight, profile } = parseAxes(item, variant);
  return [weight, profile].filter(Boolean).join(" · ") || "STANDARD";
}

export function imageForOption(item: ProductItem, label: string) {
  const urls = [...(item.images ?? []), item.image].filter((url): url is string => Boolean(url));
  if (!urls.length) return item.image;
  const compact = label.toLowerCase().replace(/\s+/g, "");
  const gram = gramToken(label);
  const keys = [compact, gram, label.toLowerCase().replace(/\s+/g, "-")].filter(Boolean);
  const scored = urls.map((url) => {
    const hay = decodeURIComponent(url).toLowerCase();
    const hit = keys.some((key) => key.length > 1 && hay.includes(key));
    return { url, hit, model: /model/i.test(hay) };
  });
  const matches = scored.filter((entry) => entry.hit);
  return matches.find((entry) => entry.model)?.url ?? matches[0]?.url ?? item.image;
}

export function imageForVariant(item: ProductItem, variant?: ProductVariant | ProductOption) {
  if (!variant) return item.image;
  if ("image" in variant && variant.image) return variant.image;
  const label = "label" in variant ? variant.label : variant.title;
  return imageForOption(item, label);
}

export function galleryForVariant(item: ProductItem, variant?: ProductVariant | ProductOption) {
  const lead = imageForVariant(item, variant);
  const rest = (item.images ?? []).filter((url) => url && url !== lead);
  return lead ? [lead, ...rest] : rest;
}

function photoRank(url: string) {
  const hay = decodeURIComponent(url).toLowerCase();
  const model = hay.includes("model");
  const product = hay.includes("product");
  if (product && !model) return 0;
  if (/\.png(\?|$)/.test(hay) && !model) return 0;
  if (model) return 2;
  return 1;
}

export function isStudioPhoto(url?: string) {
  return Boolean(url && photoRank(url) === 0);
}

export function listingGallery(item: ProductItem, lead: "studio" | "model" = "model") {
  const urls = [item.image, ...(item.images ?? []), ...(item.variants?.map((variant) => variant.image) ?? [])].filter(
    (url): url is string => Boolean(url),
  );
  const ranked = [...new Set(urls)].sort((a, b) => photoRank(a) - photoRank(b));
  return lead === "studio" ? ranked : ranked.slice().reverse();
}
