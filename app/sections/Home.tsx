"use client";

import { useEffect, useRef, useState } from "react";
import { ProductGrid } from "../components/ProductGrid";
import { categoryPlaceholders, shopProducts } from "../lib/catalog";
import { skuFor, SLOGAN } from "../lib/copy";
import { PRODUCT_COLORS, SHOP_TYPES } from "../lib/taxonomy";
import type { Go, ProductItem } from "../lib/types";

function categoryPhoto(pieces: ProductItem[], fallback?: string) {
  const urls = pieces
    .flatMap((item) => [item.image, ...(item.images ?? [])])
    .filter((url): url is string => Boolean(url));
  return urls.find((url) => /model/i.test(url)) || urls[0] || fallback;
}

function shopifyPhoto(items: ProductItem[], index = 1) {
  const urls = items
    .flatMap((item) => [item.image, ...(item.images ?? [])])
    .filter((url): url is string =>
      Boolean(url && /cdn\.shopify\.com/i.test(url)),
    );
  const models = urls.filter((url) => /model/i.test(url));
  const pool = models.length ? models : urls;
  return pool[index] || pool[0];
}

function choiceLine(pieces: ProductItem[]) {
  if (!pieces.length) return "";

  const seen = new Set<string>();
  const values: string[] = [];
  const add = (raw?: string) => {
    const clean = raw
      ?.trim()
      .replace(/\s+/g, " ")
      .replace(/\s*\/\s*(yellow|white|pink|rose)\s*gold/gi, "")
      .trim();
    if (!clean || /default title/i.test(clean)) return;
    if (/^(yellow|white|pink|rose)(\s*gold)?$/i.test(clean)) return;
    const key = clean.toUpperCase();
    if (seen.has(key)) return;
    seen.add(key);
    values.push(key);
  };

  for (const item of pieces) {
    add(item.karat);
    for (const value of item.optionValues ?? []) add(value);
    if (!item.optionValues?.length && item.options) {
      item.options.split("/").forEach((part) => add(part));
    }
    for (const variant of item.variants ?? []) add(variant.title);
  }

  return values.slice(0, 6).join(" · ");
}

export function Home({
  go,
  catalog,
  add,
  openProduct,
}: {
  go: Go;
  catalog: ProductItem[];
  add: (item: ProductItem, variantId?: string) => void;
  openProduct: (item: ProductItem) => void;
}) {
  const listed = shopProducts(catalog);
  const manifestoImage = shopifyPhoto(catalog) || listed[0]?.image;
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const row = track.current;
    if (!row) return;
    const max = row.scrollWidth - row.clientWidth;
    setCanPrev(row.scrollLeft > 2);
    setCanNext(max > 2 && row.scrollLeft < max - 2);
  };

  useEffect(() => {
    const row = track.current;
    if (!row) return;
    updateArrows();
    row.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      row.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [listed.length]);

  const scrollCategories = (direction: 1 | -1) => {
    const row = track.current;
    const card = row?.querySelector(".shop-category");
    if (!row || !(card instanceof HTMLElement)) return;
    const gap = Number.parseFloat(getComputedStyle(row).gap) || 18;
    row.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <>
      <section className="ref-hero">
        <div className="hero-editorial-copy">
          <h1>
            HIGH QUALITY/
            <br /> CUSTOMIZABLE <br />
            JEWELRY
          </h1>
          <p>
            With transparency and craftsmanship.
            <br />
            We deliver fine craft directly from our master bench straight to the
            consumer's hands.
            <br />
            No mystery, no artificial inflation.
          </p>
          <button onClick={() => go("shop")}>
            DISCOVER NOW <span>→</span>
          </button>
        </div>
        <div className="ref-hero-logo" role="img" aria-label="XJEWELRYX" />
      </section>
      <section className="ref-shop">
        <div className="ref-section-head">
          <h2>SHOP BY CATEGORY</h2>
          <button onClick={() => go("shop")}>VIEW ALL PRODUCTS →</button>
        </div>
        <div className="shop-categories-wrap">
          <div className="shop-categories" ref={track}>
            {SHOP_TYPES.map((type) => {
              const pieces = listed.filter((item) => item.type === type);
              const image = categoryPhoto(pieces, categoryPlaceholders[type]);
              const colors = [...new Set(pieces.map((item) => item.color))];
              const swatches = colors.length ? colors : [...PRODUCT_COLORS];
              const varsLabel = choiceLine(pieces);
              return (
                <article className="shop-category" key={type}>
                  <button
                    className={`shop-category-hit${image ? " has-image" : ""}`}
                    type="button"
                    style={
                      image ? { backgroundImage: `url(${image})` } : undefined
                    }
                    onClick={() => go("shop", undefined, { type })}
                    aria-label={`View all ${type.toLowerCase()}`}
                  />
                  <small>
                    {skuFor(type, 1)}
                    <br />
                    {type} / {pieces.length ? "LIVE" : "COMING"}
                  </small>
                  <div className="shop-category-foot">
                    <div className="shop-category-vars">
                      <em>{varsLabel}</em>
                      <span className="shop-category-colors">
                        {swatches.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`shop-swatch shop-swatch-${color.toLowerCase()}`}
                            aria-label={`${color.toLowerCase()} gold ${type.toLowerCase()}`}
                            onClick={() =>
                              go("shop", undefined, { type, color })
                            }
                          />
                        ))}
                      </span>
                    </div>
                    <span className="shop-category-cta">CHECK IT OUT</span>
                  </div>
                </article>
              );
            })}
          </div>
          {canPrev && (
            <button
              className="shop-categories-arrow prev"
              type="button"
              aria-label="Previous categories"
              onClick={() => scrollCategories(-1)}
            >
              ←
            </button>
          )}
          {canNext && (
            <button
              className="shop-categories-arrow next"
              type="button"
              aria-label="More categories"
              onClick={() => scrollCategories(1)}
            >
              →
            </button>
          )}
        </div>
      </section>
      <section className="ref-manifesto">
        <span className="manifesto-shape" aria-hidden="true" />
        <h2>
          WE
          <br />
          CUT
          <br />
          THE
          <br />
          FLUFF.
        </h2>
        <div
          className="manifesto-image"
          style={
            manifestoImage
              ? { backgroundImage: `url(${manifestoImage})` }
              : undefined
          }
        />
        <div className="blue-note">
          ⌜
          <span>
            YOUNG.
            <br />
            EXPERIENCED.
            <br />
            BOLD.
            <br />
            TRANSPARENT.
          </span>
          ⌟
        </div>
      </section>
      <section className="ref-materials">
        <span className="materials-shape" aria-hidden="true" />
        <span className="material-mark" aria-hidden="true" />
        <div className="material-intro">
          <h2>
            MATERIAL
            <br />
            WEIGHT
            <br />
            ORIGIN
          </h2>
          <p>
            WE BELIEVE IN TOTAL TRANSPARENCY. EVERY PIECE IS CRAFTED WITH
            PRECISION, USING PREMIUM MATERIALS AND RESPONSIBLE SOURCING.
          </p>
          <button onClick={() => go("materials")}>LEARN MORE →</button>
        </div>
        <div className="material-table">
          {[
            ["METAL", "10KT GOLD", "SOLID GOLD\nYELLOW / WHITE / PINK"],
            ["CARAT", "10KT", "KARAT IN THE NAME\nWEIGHT IN GRAMS"],
            ["ORIGIN", "CANADA", "BASED IN CANADA\nSOLD DIRECT"],
            [
              "CRAFTSMANSHIP",
              "HAND FINISHED",
              "HAND POLISHED\nQUALITY INSPECTED",
            ],
          ].map((row, index) => (
            <div className="material-spec" key={row[0]}>
              <span>
                <small>{row[0]}</small>
                <b>{row[1]}</b>
              </span>
              <em>{row[2]}</em>
              <i className={`texture texture-${index}`} />
            </div>
          ))}
        </div>
      </section>
      {listed.length > 0 && (
        <section className="ref-featured">
          <div className="ref-section-head">
            <h2>THE PIECES</h2>
            <button type="button" onClick={() => go("shop")}>VIEW ALL →</button>
          </div>
          <ProductGrid
            className="home-pieces"
            items={listed.slice(0, 8)}
            add={add}
            openProduct={openProduct}
          />
        </section>
      )}
      <section className="ref-campaign">
        <img className="campaign-photo" src="/campaign-hero.jpg?v=2" alt="" />
        <div className="campaign-ticker" aria-hidden="true">
          <span>
            {SLOGAN} ::: {SLOGAN} ::: {SLOGAN} ::: {SLOGAN} :::{" "}
          </span>
          <span>
            {SLOGAN} ::: {SLOGAN} ::: {SLOGAN} ::: {SLOGAN} :::{" "}
          </span>
        </div>
        <button
          className="campaign-cta"
          type="button"
          onClick={() => go("shop", undefined, { type: "EARRINGS" })}
        >
          SHOP EARRINGS
        </button>
      </section>
    </>
  );
}
