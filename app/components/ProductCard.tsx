"use client";

import { useMemo, useState } from "react";
import { imageForOption, productColors, productOptions } from "../lib/product-options";
import type { ProductItem } from "../lib/types";
import { ColorDots } from "./ColorDots";

export function ProductCard({
  item,
  add,
  openProduct,
}: {
  item: ProductItem;
  add: (item: ProductItem, variantId?: string) => void;
  openProduct: (item: ProductItem) => void;
}) {
  const options = useMemo(() => productOptions(item), [item]);
  const colors = useMemo(() => productColors(item), [item]);
  const [picked, setPicked] = useState(options[0]?.id ?? "");
  const active = options.find((option) => option.id === picked) ?? options[0];
  const photo = active ? (active.image || imageForOption(item, active.label)) : item.image;
  const price = active?.price ?? item.price;
  const soldOut = item.variants?.length ? item.variants.every((variant) => !variant.available) : false;
  const showChipDots = colors.length > 1;

  return (
    <article className="product-card">
      <button
        className={`product-visual${photo ? " has-image" : ""}`}
        style={photo ? { backgroundImage: `url(${photo})` } : undefined}
        onClick={() => openProduct(item)}
        aria-label={`View ${item.name}`}
      >
        <small>{item.sku || item.code} / {item.type}</small>
        <span className="product-view-cue">VIEW</span>
        {soldOut && <em className="sold-out">Sold out</em>}
      </button>
      <div className="product-info">
        <div className="product-info-top">
          <button type="button" className="product-name" onClick={() => openProduct(item)}>
            <b>{item.name}</b>
            <ColorDots colors={colors} active={active?.color} />
            <span className="product-meta">{item.type.replace(/S$/, "")}</span>
          </button>
          <div className="product-buy">
            <b>{price}</b>
            <button
              className="plus"
              type="button"
              onClick={() => add(item, active?.variantId)}
              aria-label={`Add ${item.name}`}
            >
              +
            </button>
          </div>
        </div>
        {options.length > 0 && (
          <div className="product-options" role="group" aria-label={`${item.name} options`}>
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`product-chip${option.id === active?.id ? " is-on" : ""}`}
                onClick={() => setPicked(option.id)}
              >
                {showChipDots && option.color ? (
                  <i className={`shop-swatch shop-swatch-${option.color.toLowerCase()}`} aria-hidden />
                ) : null}
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
