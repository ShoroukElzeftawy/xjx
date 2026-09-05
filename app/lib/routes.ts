import { isShopListed } from "./catalog";
import { PRODUCT_COLORS, SHOP_TYPES } from "./taxonomy";
import type { ProductItem, Route, ShopQuery } from "./types";

const routes: Route[] = ["shop", "product", "custom", "materials", "about", "refer"];

function isShopType(value?: string) {
  return Boolean(value && (value === "ALL" || (SHOP_TYPES as readonly string[]).includes(value)));
}

function isShopColor(value?: string) {
  return Boolean(value && (value === "ALL" || (PRODUCT_COLORS as readonly string[]).includes(value)));
}

export function pathFor(route: Route, handle?: string, query?: ShopQuery) {
  if (route === "home") return "/";
  if (route === "product" && handle) return `/product/${handle}`;
  if (route === "shop") {
    const type = query?.type && query.type !== "ALL" ? query.type.toLowerCase() : "";
    const color = query?.color && query.color !== "ALL" ? query.color.toLowerCase() : "";
    if (type && color) return `/shop/${type}/${color}`;
    if (type) return `/shop/${type}`;
    return "/shop";
  }
  return `/${route}`;
}

export function shopQueryFromSearch(search = typeof window === "undefined" ? "" : window.location.search): ShopQuery {
  const params = new URLSearchParams(search);
  const type = params.get("type")?.toUpperCase();
  const color = params.get("color")?.toUpperCase();
  return {
    type: isShopType(type) ? type : "ALL",
    color: isShopColor(color) ? color : "ALL",
  };
}

export function routeFromPath(pathname: string): { route: Route; handle?: string; query?: ShopQuery } {
  const parts = pathname.split("/").filter(Boolean);
  const key = parts[0] as Route;
  if (key === "product") return { route: "product", handle: parts[1] };
  if (key === "shop") {
    const search = shopQueryFromSearch();
    const typeSeg = parts[1]?.toUpperCase();
    const colorSeg = parts[2]?.toUpperCase();
    return {
      route: "shop",
      query: {
        type: isShopType(typeSeg) ? typeSeg : search.type || "ALL",
        color: isShopColor(colorSeg) ? colorSeg : search.color || "ALL",
      },
    };
  }
  return { route: routes.includes(key) ? key : "home" };
}

export function productFromHandle(catalog: ProductItem[], handle?: string) {
  const listed = catalog.filter(isShopListed);
  if (!handle) return listed[0] ?? catalog[0];
  return catalog.find((item) => item.handle === handle) ?? listed[0] ?? catalog[0];
}
