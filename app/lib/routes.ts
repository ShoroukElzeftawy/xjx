import type { ProductItem, Route } from "./types";

const routes: Route[] = ["shop", "product", "custom", "materials", "about"];

export function pathFor(route: Route, handle?: string) {
  if (route === "home") return "/";
  if (route === "product" && handle) return `/product/${handle}`;
  return `/${route}`;
}

export function routeFromPath(pathname = typeof window === "undefined" ? "/" : window.location.pathname): { route: Route; handle?: string } {
  const parts = pathname.split("/").filter(Boolean);
  const key = parts[0] as Route;
  if (key === "product") return { route: "product", handle: parts[1] };
  return { route: routes.includes(key) ? key : "home" };
}

export function productFromHandle(catalog: ProductItem[], handle?: string) {
  if (!handle) return catalog[0];
  return catalog.find((item) => item.handle === handle) ?? catalog[0];
}
