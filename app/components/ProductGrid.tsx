import type { ProductItem } from "../lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  items,
  add,
  openProduct,
}: {
  items: ProductItem[];
  add: (item: ProductItem, variantId?: string) => void;
  openProduct: (item: ProductItem) => void;
}) {
  return (
    <section className="products">
      <div className="product-grid">
        {items.map((item) => (
          <ProductCard key={item.code} item={item} add={add} openProduct={openProduct} />
        ))}
      </div>
    </section>
  );
}
