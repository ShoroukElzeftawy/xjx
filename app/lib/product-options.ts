import type { ProductItem, ProductVariant } from "./types";

export type ProductOption = {
  id: string;
  label: string;
  price?: string;
  variantId?: string;
  image?: string;
};

function optionLabel(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

function isPlaceholderTitle(title: string) {
  return !title || /default title/i.test(title);
}

export function productOptions(item: ProductItem): ProductOption[] {
  const variants = (item.variants ?? []).filter((variant) => !isPlaceholderTitle(optionLabel(variant.title || "")));
  if (variants.length) {
    return variants.map((variant) => ({
      id: variant.id,
      label: optionLabel(variant.title),
      price: variant.price,
      variantId: variant.id,
      image: variant.image || imageForOption(item, variant.title),
    }));
  }
  return [];
}

function gramToken(value: string) {
  const match = value.toLowerCase().replace(/,/g, ".").match(/(\d+(?:\.\d+)?)\s*g\b/);
  return match ? `${match[1]}g` : "";
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
