"use client";

import { useMemo, useState } from "react";
import { matchVariant, parseAxes, uniqueAxes } from "../lib/product-options";
import type { ProductColor } from "../lib/taxonomy";
import type { ProductItem } from "../lib/types";
import { ColorDots } from "./ColorDots";
import { ProductOptions } from "./ProductOptions";

export function ProductCard({
  item,
  add,
  openProduct,
}: {
  item: ProductItem;
  add: (item: ProductItem, variantId?: string) => void;
  openProduct: (item: ProductItem) => void;
}) {
  const { colors } = useMemo(() => uniqueAxes(item), [item]);
  const [picked, setPicked] = useState(item.variantId ?? item.variants?.[0]?.id ?? "");
  const active = item.variants?.find((variant) => variant.id === picked) ?? item.variants?.[0];
  const axes = parseAxes(item, active);
  const photo = active?.image || item.image;
  const price = active?.price ?? item.price;
  const soldOut = item.variants?.length ? item.variants.every((variant) => !variant.available) : false;

  const pickColor = (color: ProductColor) => {
    const match = matchVariant(item, { color }, active);
    if (match) setPicked(match.id);
  };

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
            <span className="product-meta">{item.type.replace(/S$/, "")}</span>
          </button>
          <div className="product-buy">
            <b>{price}</b>
            <button
              className="plus"
              type="button"
              onClick={() => add(item, active?.id)}
              aria-label={`Add ${item.name}`}
            >
              +
            </button>
          </div>
        </div>
        <ColorDots colors={colors} active={axes.color} onPick={colors.length > 1 ? pickColor : undefined} />
        <ProductOptions item={item} variantId={active?.id} onPick={setPicked} />
      </div>
    </article>
  );
}
