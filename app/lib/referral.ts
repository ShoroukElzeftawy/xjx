function publicEnv(name: string) {
  const meta = import.meta as ImportMeta & { env?: Record<string, string | undefined> };
  const fromMeta = meta.env?.[name] ?? "";
  const fromProcess = typeof process !== "undefined" ? process.env[name] ?? "" : "";
  return String(fromMeta || fromProcess).trim();
}

function httpUrl(value: string) {
  if (!value || value === "undefined" || value === "null") return "";
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

const DEFAULT_JOIN_URL = "https://xjewelryx.refr.cc/join/default";

/** ReferralCandy Join Page. Public URL, not a secret. */
export const referralCandyJoinUrl =
  httpUrl(publicEnv("NEXT_PUBLIC_REFERRALCANDY_JOIN_URL")) || DEFAULT_JOIN_URL;

/** Optional Embedded signup widget id from Widgets → Copy iframe. */
export const referralCandyWidgetId = publicEnv("NEXT_PUBLIC_REFERRALCANDY_WIDGET_ID").replace(/^(undefined|null)$/i, "");
