"use client";

import { useEffect, useState } from "react";
import { productUrl } from "../lib/catalog";
import type { Go, ProductItem } from "../lib/types";

export function Product({
  item,
  add,
  go,
}: {
  item: ProductItem;
  add: (item: ProductItem, variantId?: string) => void;
  go: Go;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [variantId, setVariantId] = useState(item.variantId ?? item.variants?.[0]?.id);
  const gallery = item.images?.length ? item.images : item.image ? [item.image] : [];
  const active = item.variants?.find((variant) => variant.id === variantId);

  useEffect(() => {
    setImageIndex(0);
    setVariantId(item.variantId ?? item.variants?.[0]?.id);
  }, [item.code, item.variantId, item.variants]);

  const moveImage = (direction: number) => {
    setImageIndex((current) => (current + direction + gallery.length) % gallery.length);
  };

  return (
    <>
      <section className="product-page">
        <div
          className="product-gallery carousel"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") moveImage(-1);
            if (event.key === "ArrowRight") moveImage(1);
          }}
          aria-label={`${item.name} image gallery`}
        >
          <div className="gallery-main imported" style={{ backgroundImage: `url(${gallery[imageIndex]})` }}>
            <small>{item.code} / IMAGE {String(imageIndex + 1).padStart(2, "0")} OF {String(gallery.length).padStart(2, "0")}</small>
            {gallery.length > 1 && (
              <div className="gallery-controls">
                <button onClick={() => moveImage(-1)} aria-label="Previous product image">←</button>
                <button onClick={() => moveImage(1)} aria-label="Next product image">→</button>
              </div>
            )}
          </div>
        </div>
        <div className="buy-panel">
          <p className="eyebrow">{item.code} / {item.type.replace(/S$/, "")}</p>
          <h1>{item.name}</h1>
          <p className="price">{active?.price ?? item.price} <span>LIVE PRICE</span></p>
          <p className="description">
            {item.description || "An original XJEWELRYX object from the live catalog. Weight, karat, and options are listed. No markup theater."}
          </p>
          <fieldset>
            <legend>AVAILABLE OPTIONS</legend>
            {(item.variants?.length ? item.variants : [{ id: item.variantId ?? item.code, title: item.options || "STANDARD", price: item.price, available: true }]).map((variant) => (
              <button
                key={variant.id}
                className={variantId === variant.id ? "selected" : ""}
                onClick={() => setVariantId(variant.id)}
              >
                {variant.title}
              </button>
            ))}
          </fieldset>
          <button className="add" onClick={() => add({ ...item, variantId }, variantId)}>
            ADD TO BAG — {active?.price ?? item.price} <b>↗</b>
          </button>
          <a className="store-link" href={productUrl(item.handle)} target="_blank" rel="noreferrer">
            OPEN IN SHOPIFY
          </a>
          <div className="specs">
            <span>ORIGIN<br /><b>47TH STREET</b></span>
            <span>TYPE<br /><b>{item.type}</b></span>
            <span>COLOR<br /><b>{item.color} GOLD</b></span>
          </div>
        </div>
      </section>
      <section className="detail-story">
        <p>01 / CONSTRUCTION</p>
        <h2>STRUCTURAL GOLD.<br /><i>NO ROMANCE.</i></h2>
        <p>We sell engineered gold, ethically sourced diamonds, and forms made for people who buy for themselves.</p>
      </section>
      <section className="next-object">
        <p>RETURN TO COLLECTION</p>
        <button onClick={() => go("shop")}>VIEW ALL OBJECTS <span>↗</span></button>
      </section>
    </>
  );
}
