"use client";

import { ProductGrid } from "../components/ProductGrid";
import type { ProductItem } from "../lib/types";

export function Saved({
  items,
  add,
  openProduct,
  likedIds,
  onToggleLike,
}: {
  items: ProductItem[];
  add: (item: ProductItem, variantId?: string) => void;
  openProduct: (item: ProductItem) => void;
  likedIds: string[];
  onToggleLike: (item: ProductItem) => void;
}) {
  return (
    <>
      <section className="page-head">
        <p className="eyebrow">[ SAVED / WISHLIST ]</p>
        <h1>SAVED<br /><i>PIECES.</i></h1>
      </section>
      {items.length ? (
        <ProductGrid
          items={items}
          add={add}
          openProduct={openProduct}
          likedIds={likedIds}
          onToggleLike={onToggleLike}
        />
      ) : (
        <div className="shop-empty">
          <p>Nothing saved yet.</p>
          <span>Tap the heart on a piece to keep it here.</span>
        </div>
      )}
    </>
  );
}
