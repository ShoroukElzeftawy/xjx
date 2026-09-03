import { isShopListed } from "./catalog";
import type { ProductItem, Route, ShopQuery } from "./types";

const routes: Route[] = ["shop", "product", "custom", "materials", "about", "refer"];

export function pathFor(route: Route, handle?: string, query?: ShopQuery) {
  if (route === "home") return "/";
  if (route === "product" && handle) return `/product/${handle}`;
  if (route === "shop") {
    const params = new URLSearchParams();
    if (query?.type && query.type !== "ALL") params.set("type", query.type.toLowerCase());
    if (query?.color && query.color !== "ALL") params.set("color", query.color.toLowerCase());
    const search = params.toString();
    return search ? `/shop?${search}` : "/shop";
  }
  return `/${route}`;
}

export function shopQueryFromSearch(search = typeof window === "undefined" ? "" : window.location.search): ShopQuery {
  const params = new URLSearchParams(search);
  const type = params.get("type")?.toUpperCase();
  const color = params.get("color")?.toUpperCase();
  return {
    type: type || "ALL",
    color: color || "ALL",
  };
}

export function routeFromPath(pathname = typeof window === "undefined" ? "/" : window.location.pathname): { route: Route; handle?: string; query?: ShopQuery } {
  const parts = pathname.split("/").filter(Boolean);
  const key = parts[0] as Route;
  if (key === "product") return { route: "product", handle: parts[1] };
  if (key === "shop") return { route: "shop", query: shopQueryFromSearch() };
  return { route: routes.includes(key) ? key : "home" };
}

export function productFromHandle(catalog: ProductItem[], handle?: string) {
  const listed = catalog.filter(isShopListed);
  if (!handle) return listed[0] ?? catalog[0];
  return catalog.find((item) => item.handle === handle) ?? listed[0] ?? catalog[0];
}
