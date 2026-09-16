"use client";

import { matchVariant, parseAxes, uniqueAxes } from "../lib/product-options";
import type { ProductColor } from "../lib/taxonomy";
import type { ProductItem } from "../lib/types";

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
  const { weights, profiles } = uniqueAxes(item);

  const choose = (next: { color?: ProductColor; weight?: string; profile?: string }) => {
    const match = matchVariant(item, next, current);
    if (match) onPick(match.id);
  };

  if (weights.length < 2 && profiles.length < 2) return null;

  return (
    <div className="product-axes">
      {weights.length > 1 && (
        <div className="product-options" role="group" aria-label="Weight">
          {labeled ? <p className="product-axis-label">WEIGHT</p> : null}
          {weights.map((weight) => (
            <button
              key={weight}
              type="button"
              className={`product-chip${axes.weight === weight ? " is-on" : ""}`}
              onClick={() => choose({ weight })}
            >
              {weight}
            </button>
          ))}
        </div>
      )}
      {profiles.length > 1 && (
        <div className="product-options" role="group" aria-label="Profile">
          {labeled ? <p className="product-axis-label">PROFILE</p> : null}
          {profiles.map((profile) => (
            <button
              key={profile}
              type="button"
              className={`product-chip${axes.profile === profile ? " is-on" : ""}`}
              onClick={() => choose({ profile })}
            >
              {profile}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
