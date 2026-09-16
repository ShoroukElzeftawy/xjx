"use client";

import { comboExists, matchVariant, parseAxes, uniqueAxes } from "../lib/product-options";
import type { ProductColor } from "../lib/taxonomy";
import type { ProductItem } from "../lib/types";

function colorLabel(color: ProductColor) {
  if (color === "YELLOW") return "GOLD";
  if (color === "WHITE") return "WHITE GOLD";
  return "PINK GOLD";
}

export function ProductOptions({
  item,
  variantId,
  onPick,
  labeled,
}: {
  item: ProductItem;
  variantId?: string;
  onPick: (id: string) => void;
  labeled?: boolean;
}) {
  const variants = item.variants ?? [];
  const current = variants.find((variant) => variant.id === variantId) ?? variants[0];
  const axes = parseAxes(item, current);
  const { colors, weights, profiles } = uniqueAxes(item);

  const choose = (next: { color?: ProductColor; weight?: string; profile?: string }) => {
    const match = matchVariant(item, next, current);
    if (match) onPick(match.id);
  };

  if (!colors.length && !weights.length && !profiles.length) return null;

  return (
    <div className="product-axes">
      {colors.length > 0 && (
        <div className="product-options" role="group" aria-label="Color">
          {labeled ? <p className="product-axis-label">COLOR</p> : null}
          {colors.map((color) => {
            const available =
              axes.color === color || comboExists(item, { color, weight: axes.weight, profile: axes.profile });
            return (
              <button
                key={color}
                type="button"
                className={`product-chip${axes.color === color ? " is-on" : ""}${available ? "" : " is-unavailable"}`}
                aria-disabled={!available}
                onClick={() => choose({ color })}
              >
                <i className={`shop-swatch shop-swatch-${color.toLowerCase()}`} aria-hidden="true" />
                {colorLabel(color)}
              </button>
            );
          })}
        </div>
      )}
      {weights.length > 0 && (
        <div className="product-options" role="group" aria-label="Weight">
          {labeled ? <p className="product-axis-label">WEIGHT</p> : null}
          {weights.map((weight) => {
            const available =
              axes.weight === weight || comboExists(item, { color: axes.color, profile: axes.profile, weight });
            return (
              <button
                key={weight}
                type="button"
                className={`product-chip${axes.weight === weight ? " is-on" : ""}${available ? "" : " is-unavailable"}`}
                aria-disabled={!available}
                onClick={() => choose({ weight })}
              >
                {weight}
              </button>
            );
          })}
        </div>
      )}
      {profiles.length > 0 && (
        <div className="product-options" role="group" aria-label="Profile">
          {labeled ? <p className="product-axis-label">PROFILE</p> : null}
          {profiles.map((profile) => {
            const available =
              axes.profile === profile || comboExists(item, { color: axes.color, weight: axes.weight, profile });
            return (
              <button
                key={profile}
                type="button"
                className={`product-chip${axes.profile === profile ? " is-on" : ""}${available ? "" : " is-unavailable"}`}
                aria-disabled={!available}
                onClick={() => choose({ profile })}
              >
                {profile}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
