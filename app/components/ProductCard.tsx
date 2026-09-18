"use client";

import { useEffect, useMemo, useState } from "react";
import { colorFromText, isStudioPhoto, listingGalleryForColor, matchVariant, uniqueAxes } from "../lib/product-options";
import { onSkinChange, photoForSkin, readStoredSkin, type SkinIndex } from "../lib/skin-tone";
import type { ProductColor } from "../lib/taxonomy";
import type { ProductItem } from "../lib/types";
import { ColorDots } from "./ColorDots";
import { HeartIcon } from "./Heart";

export function ProductCard({
  item,
  openProduct,
  liked,
  onToggleLike,
  lead = "model",
}: {
  item: ProductItem;
  add?: (item: ProductItem, variantId?: string) => void;
  openProduct: (item: ProductItem) => void;
  liked?: boolean;
  onToggleLike?: (item: ProductItem) => void;
  lead?: "studio" | "model";
}) {
  const colors = uniqueAxes(item).colors;
  const [imageIndex, setImageIndex] = useState(0);
  const [skin, setSkin] = useState<SkinIndex>(2);
  const [color, setColor] = useState<ProductColor>(colors[0] ?? "YELLOW");
  const gallery = useMemo(() => listingGalleryForColor(item, color, lead), [item, color, lead]);

  useEffect(() => {
    setSkin(readStoredSkin());
    return onSkinChange(setSkin);
  }, []);

  useEffect(() => {
    setImageIndex(0);
  }, [skin, color]);

  useEffect(() => {
    if (!colors.includes(color)) setColor(colors[0] ?? "YELLOW");
  }, [colors, color]);

  const preferred = lead === "model" ? photoForSkin(gallery, skin) : undefined;
  const preferredColor = preferred ? colorFromText(preferred) : undefined;
  const preferredOk = preferred && (!preferredColor || preferredColor === color);
  const photo = gallery.length
    ? imageIndex === 0 && preferredOk
      ? preferred
      : gallery[imageIndex % gallery.length]
    : undefined;
  const studio = isStudioPhoto(photo);
  const price = matchVariant(item, { color })?.price ?? item.variants?.[0]?.price ?? item.price;
  const soldOut = item.variants?.length ? item.variants.every((variant) => !variant.available) : false;
  const canSlide = gallery.length > 1;

  const move = (direction: -1 | 1) => {
    setImageIndex((current) => (current + direction + gallery.length) % gallery.length);
  };

  return (
    <article className="product-card">
      <div className={`product-visual${photo ? " has-image" : ""}${studio ? " is-studio" : ""}`} style={photo ? { backgroundImage: `url(${photo})` } : undefined}>
        <button type="button" className="product-open" onClick={() => openProduct(item)} aria-label={`View ${item.name}`} />
        {canSlide ? (
          <>
            <button
              type="button"
              className="product-slide prev"
              aria-label="Previous photo"
              onClick={(event) => {
                event.stopPropagation();
                move(-1);
              }}
            >
              ←
            </button>
            <button
              type="button"
              className="product-slide next"
              aria-label="Next photo"
              onClick={(event) => {
                event.stopPropagation();
                move(1);
              }}
            >
              →
            </button>
          </>
        ) : null}
        {soldOut && <em className="sold-out">Sold out</em>}
      </div>
      <div className="product-info">
        <div className="product-info-top">
          <button type="button" className="product-name" onClick={() => openProduct(item)}>
            {item.name}
          </button>
          {onToggleLike ? (
            <button
              type="button"
              className={`like-toggle${liked ? " is-on" : ""}`}
              aria-label={liked ? `Remove ${item.name} from saved` : `Save ${item.name}`}
              aria-pressed={liked}
              onClick={(event) => {
                event.stopPropagation();
                onToggleLike(item);
              }}
            >
              <HeartIcon filled={liked} />
            </button>
          ) : null}
        </div>
        <div className="product-price-row">
          <b className="product-price">{price}</b>
          <ColorDots
            colors={colors}
            active={color}
            onPick={(next) => {
              setColor(next);
              setImageIndex(0);
            }}
          />
        </div>
      </div>
    </article>
  );
}
