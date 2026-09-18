const SKIN_KEY = "xjx-skin";
const SKIN_EVENT = "xjx-skin";

export const SKIN_STOPS = [
  { id: "fair", label: "Fair", swatch: "#f4d4c1" },
  { id: "light", label: "Light", swatch: "#e2b394" },
  { id: "medium", label: "Medium", swatch: "#c4895e" },
  { id: "tan", label: "Tan", swatch: "#8d5636" },
  { id: "deep", label: "Deep", swatch: "#4a2b1c" },
] as const;

export type SkinIndex = 0 | 1 | 2 | 3 | 4;

function clampSkin(value: number): SkinIndex {
  if (value <= 0) return 0;
  if (value >= 4) return 4;
  return Math.round(value) as SkinIndex;
}

function haystack(url: string) {
  try {
    return decodeURIComponent(url).toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

export function skinFromUrl(url: string): SkinIndex | undefined {
  const hay = haystack(url);
  const numbered = hay.match(/(?:skin|tone|fitz)[-_]?([1-5])/);
  if (numbered) return clampSkin(Number(numbered[1]) - 1);
  if (/\b(fair|porcelain|ivory)\b/.test(hay)) return 0;
  if (/\b(light|beige)\b/.test(hay)) return 1;
  if (/\b(medium|olive|golden)\b/.test(hay)) return 2;
  if (/\b(tan|brown)\b/.test(hay)) return 3;
  if (/\b(deep|dark|ebony|rich)\b/.test(hay)) return 4;
  return undefined;
}

export function modelPhotos(urls: string[]) {
  const unique = [...new Set(urls.filter(Boolean))];
  const named = unique.filter((url) => /model/i.test(haystack(url)));
  if (named.length) return named;
  return unique.filter((url) => {
    const hay = haystack(url);
    if (hay.includes("product") && !hay.includes("model")) return false;
    if (/\.png(\?|$)/.test(hay) && !hay.includes("model")) return false;
    return true;
  });
}

export function photoForSkin(urls: string[], skin: SkinIndex) {
  const models = modelPhotos(urls);
  if (!models.length) return undefined;
  const tagged = models
    .map((url) => ({ url, skin: skinFromUrl(url) }))
    .filter((entry): entry is { url: string; skin: SkinIndex } => entry.skin !== undefined);
  if (tagged.length) {
    return tagged.reduce((best, entry) =>
      Math.abs(entry.skin - skin) < Math.abs(best.skin - skin) ? entry : best,
    ).url;
  }
  if (models.length === 1) return models[0];
  const index = Math.round((skin / 4) * (models.length - 1));
  return models[index];
}

export function readStoredSkin(): SkinIndex {
  if (typeof window === "undefined") return 2;
  try {
    const raw = window.localStorage.getItem(SKIN_KEY);
    if (raw == null) return 2;
    const value = Number(raw);
    return Number.isFinite(value) ? clampSkin(value) : 2;
  } catch {
    return 2;
  }
}

export function writeStoredSkin(skin: SkinIndex) {
  try {
    window.localStorage.setItem(SKIN_KEY, String(skin));
  } catch {
    undefined;
  }
  window.dispatchEvent(new CustomEvent(SKIN_EVENT, { detail: skin }));
}

export function onSkinChange(handler: (skin: SkinIndex) => void) {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent).detail;
    if (typeof detail === "number") handler(clampSkin(detail));
  };
  window.addEventListener(SKIN_EVENT, listener);
  return () => window.removeEventListener(SKIN_EVENT, listener);
}
