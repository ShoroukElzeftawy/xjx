import { ProductGrid } from "../components/ProductGrid";
import type { Go, ProductItem } from "../lib/types";

export function Home({
  go,
  add,
  catalog,
  openProduct,
}: {
  go: Go;
  add: (item: ProductItem) => void;
  catalog: ProductItem[];
  openProduct: (item: ProductItem) => void;
}) {
  return (
    <>
      <section className="ref-hero">
        <div className="hero-editorial-copy">
          <h1>HIGH-QUALITY AND<br />CUSTOMIZABLE JEWELRY<br />WITH TRANSPARENCY<br />AND CRAFTSMANSHIP.</h1>
          <p>Fine craft from the bench to your hands. No mystery. No artificial inflation.</p>
          <button onClick={() => go("shop")}>DISCOVER NOW <span>→</span></button>
        </div>
        <div className="ref-hero-logo" role="img" aria-label="XJEWELRYX" />
        <div className="hero-ref">40.7580° N, 73.9808° W · XJX–001</div>
      </section>
      <section className="ref-shop">
        <div className="ref-section-head">
          <h2>SHOP NEW</h2>
          <button onClick={() => go("shop")}>VIEW ALL　→</button>
        </div>
        <ProductGrid items={catalog.slice(0, 3)} add={add} openProduct={openProduct} />
      </section>
      <section className="ref-manifesto">
        <h2>BUILT<br />WITHOUT<br />THE<br />MARKUP.</h2>
        <div className="manifesto-image" style={{ backgroundImage: `url(${catalog[0]?.image})` }} />
        <div className="blue-note">
          ⌜<span>YOUNG.<br />EXPERIENCED.<br />BOLD.<br />TRANSPARENT.</span>⌟
        </div>
        <div className="gold-line"><b>XJX</b></div>
      </section>
      <section className="ref-materials">
        <div className="material-intro">
          <h2>MATERIAL /<br />WEIGHT /<br />ORIGIN</h2>
          <p>WE BELIEVE IN TOTAL TRANSPARENCY. EVERY PIECE IS CRAFTED WITH PRECISION, USING PREMIUM MATERIALS AND RESPONSIBLE SOURCING.</p>
          <button onClick={() => go("materials")}>LEARN MORE　→</button>
        </div>
        <div className="material-table">
          {[
            ["METAL", "10KT / 18KT GOLD", "KARAT AND WEIGHT DISCLOSED\nNO HIDDEN ALLOY STORY"],
            ["CARAT", "DIRECT DIAMONDS", "ETHICALLY SOURCED\nORIGIN ON REQUEST"],
            ["ORIGIN", "NEW YORK", "15 WEST 47TH STREET\nSUITE 802"],
            ["CRAFTSMANSHIP", "BENCH MADE", "HAND FINISHED\nQUALITY INSPECTED"],
          ].map((row, index) => (
            <div className="material-spec" key={row[0]}>
              <span><small>{row[0]}</small><b>{row[1]}</b></span>
              <em>{row[2]}</em>
              <i className={`texture texture-${index}`} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
