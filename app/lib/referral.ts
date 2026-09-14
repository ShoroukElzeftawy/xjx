function publicEnv(name: string) {
  let value = "";
  try {
    const env = import.meta.env as Record<string, string | undefined>;
    value = env[name] ?? "";
  } catch {
    value = "";
  }
  if (!value && typeof process !== "undefined") {
    value = process.env[name] ?? "";
  }
  return String(value).trim();
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
