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
  const sku = item.sku || item.code;

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
            <small>{sku} / IMAGE {String(imageIndex + 1).padStart(2, "0")} OF {String(gallery.length).padStart(2, "0")}</small>
            {gallery.length > 1 && (
              <div className="gallery-controls">
                <button onClick={() => moveImage(-1)} aria-label="Previous product image">←</button>
                <button onClick={() => moveImage(1)} aria-label="Next product image">→</button>
              </div>
            )}
          </div>
        </div>
        <div className="buy-panel">
          <p className="eyebrow">{sku} / {item.type.replace(/S$/, "")}</p>
          <h1>{item.name}</h1>
          <p className="price">{active?.price ?? item.price} <span>LIVE PRICE</span></p>
          <p className="description">
            {item.description || "An original XJEWELRYX object. Weight, karat, and options are listed. Size is given by comparison, not only millimeters."}
          </p>
          <div className="size-compare">
            <p>SIZE, COMPARED</p>
            <p>{item.sizeCompare || "We size against something you already wear — a coin, a hoop, a chain on the neck — not a tape measure alone."}</p>
          </div>
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
            <span>SKU<br /><b>{sku}</b></span>
            <span>TYPE<br /><b>{item.type}</b></span>
            <span>COLOR<br /><b>{item.color} GOLD</b></span>
            <span>KARAT<br /><b>{item.karat || "SEE OPTIONS"}</b></span>
          </div>
        </div>
      </section>
      <section className="detail-story">
        <p>01 / CONSTRUCTION</p>
        <h2>STRUCTURAL GOLD.<br /><i>NO ROMANCE.</i></h2>
        <p>Folder codes mark the family: XJ4 earrings, XJ3 bracelets, XJ2 rings, XJ5 necklaces, XJ1 chains. The number is the object. Karat is in the name, not hidden in a spec sheet.</p>
      </section>
      <section className="next-object">
        <p>RETURN TO COLLECTION</p>
        <button onClick={() => go("shop")}>VIEW ALL OBJECTS <span>↗</span></button>
      </section>
    </>
  );
}
