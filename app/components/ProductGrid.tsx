import type { ProductItem } from "../lib/types";
import { itemKey } from "./Heart";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  items,
  add,
  openProduct,
  className,
  likedIds,
  onToggleLike,
  lead = "model",
}: {
  items: ProductItem[];
  add: (item: ProductItem, variantId?: string) => void;
  openProduct: (item: ProductItem) => void;
  className?: string;
  likedIds?: string[];
  onToggleLike?: (item: ProductItem) => void;
  lead?: "studio" | "model";
}) {
  return (
    <section className={className ? `products ${className}` : "products"}>
      <div className="product-grid">
        {items.map((item) => (
          <ProductCard
            key={item.code}
            item={item}
            add={add}
            openProduct={openProduct}
            liked={likedIds?.includes(itemKey(item))}
            onToggleLike={onToggleLike}
            lead={lead}
          />
        ))}
      </div>
    </section>
  );
}
