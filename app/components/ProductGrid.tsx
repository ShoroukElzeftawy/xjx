import type { ProductItem } from "../lib/types";

export function ProductGrid({
  items,
  add,
  openProduct,
}: {
  items: ProductItem[];
  add: (item: ProductItem) => void;
  openProduct: (item: ProductItem) => void;
}) {
  return (
    <section className="products">
      <div className="product-grid">
        {items.map((item) => (
          <article className="product-card" key={item.code}>
            <button
              className={`product-visual ${item.tone} has-image`}
              style={{ backgroundImage: `url(${item.image})` }}
              onClick={() => openProduct(item)}
              aria-label={`View ${item.name}`}
            >
              <small>{item.code} / SHOPIFY / ACTIVE</small>
              {item.variants && item.variants.every((variant) => !variant.available) && (
                <em className="sold-out">Sold out</em>
              )}
            </button>
            <div className="product-info">
              <button onClick={() => openProduct(item)}>
                <b>{item.name}</b>
                <span>{item.type.replace(/S$/, "")} / {item.color} GOLD / {item.options}</span>
              </button>
              <div>
                <b>{item.price}</b>
                <button className="plus" onClick={() => add(item)} aria-label={`Add ${item.name}`}>＋</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
