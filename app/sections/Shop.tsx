"use client";

import { useMemo } from "react";
import { ProductGrid } from "../components/ProductGrid";
import { shopProducts } from "../lib/catalog";
import { COMING_TYPES, PRODUCT_COLORS, SHOP_TYPES } from "../lib/taxonomy";
import type { Go, ProductItem, ShopQuery } from "../lib/types";

export function Shop({
  go,
  add,
  catalog,
  query,
  openProduct,
  live,
}: {
  go: Go;
  add: (item: ProductItem) => void;
  catalog: ProductItem[];
  query: ShopQuery;
  openProduct: (item: ProductItem) => void;
  live?: boolean;
}) {
  const type = query.type || "ALL";
  const color = query.color || "ALL";
  const filtered = useMemo(
    () =>
      shopProducts(catalog).filter(
        (item) => (type === "ALL" || item.type === type) && (color === "ALL" || item.color === color),
      ),
    [catalog, type, color],
  );

  const setQuery = (next: ShopQuery) => go("shop", undefined, next);
  const coming = (COMING_TYPES as readonly string[]).includes(type);

  return (
    <>
      <section className="page-head">
        <p className="eyebrow">[ SHOP / TYPE & COLOR ]</p>
        <h1>OBJECTS FOR<br /><i>THE BODY.</i></h1>
        <p>{String(filtered.length).padStart(2, "0")} PIECES / {type === "ALL" ? "ALL TYPES" : type} / {color === "ALL" ? "ALL COLORS" : `${color} GOLD`}</p>
      </section>
      <div className="filters-stack">
        <div className="filters" role="tablist" aria-label="Shop by type">
          <span>TYPE</span>
          {["ALL", ...SHOP_TYPES].map((item) => (
            <button className={type === item ? "active" : ""} onClick={() => setQuery({ type: item, color })} key={`type-${item}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="filters" role="tablist" aria-label="Shop by color">
          <span>COLOR</span>
          {["ALL", ...PRODUCT_COLORS].map((item) => (
            <button className={color === item ? "active" : ""} onClick={() => setQuery({ type, color: item })} key={`color-${item}`}>
              {item === "ALL" ? "ALL" : `${item} GOLD`}
            </button>
          ))}
        </div>
      </div>
      {filtered.length ? (
        <ProductGrid items={filtered} add={add} openProduct={openProduct} />
      ) : (
        <div className="shop-empty">
          <p>{coming ? "Coming from the bench." : "Nothing in this category yet."}</p>
          <span>
            {coming
              ? `${type} are being built now. Earrings are live. Try another type, or check back when this family leaves the bench.`
              : "Try another type or color. Bracelets, rings, and necklaces are coming from the bench."}
          </span>
        </div>
      )}
      <section className="shop-note">
        <span>NO. 01</span>
        <h2>SMALL RUN.<br />LONG LIFE.</h2>
        <p>Limited quantities or made to order. That keeps quality high, waste low, and the process human. {live ? "Prices and stock are live from Shopify." : "Showing the preview catalog until Shopify is connected."}</p>
      </section>
    </>
  );
}
