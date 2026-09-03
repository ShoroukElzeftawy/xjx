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
          <p>We deliver fine craft directly from our master bench straight to the consumer&apos;s hands. No mystery, no artificial inflation.</p>
          <button onClick={() => go("shop")}>DISCOVER NOW <span>→</span></button>
        </div>
        <div className="ref-hero-logo" role="img" aria-label="XJEWELRYX" />
        <div className="hero-ref">XJX–001</div>
      </section>
      <section className="ref-shop">
        <div className="ref-section-head">
          <h2>SHOP NEW</h2>
          <button onClick={() => go("shop")}>VIEW ALL →</button>
        </div>
        <ProductGrid items={catalog.slice(0, 3)} add={add} openProduct={openProduct} />
      </section>
      <section className="ref-manifesto">
        <h2>BUILT<br />WITHOUT<br />THE<br />MARKUP.</h2>
        <div className="manifesto-image" style={{ backgroundImage: `url(${catalog[0]?.image})` }} />
        <div className="blue-note">
          ⌜<span>YOUNG.<br />EXPERIENCED.<br />BOLD.<br />TRANSPARENT.</span>⌟
        </div>
      </section>
      <section className="ref-materials">
        <div className="gold-line"><b>XJX</b></div>
        <p className="material-kicker">01 / MATERIAL SYSTEM</p>
        <div className="material-intro">
          <h2>MATERIAL /<br />WEIGHT /<br />ORIGIN</h2>
          <p>WE BELIEVE IN TOTAL TRANSPARENCY. EVERY PIECE IS CRAFTED WITH PRECISION, USING PREMIUM MATERIALS AND RESPONSIBLE SOURCING.</p>
          <button onClick={() => go("materials")}>LEARN MORE →</button>
        </div>
        <div className="material-table">
          {[
            ["METAL", "925 SILVER", "92.5% PURE SILVER\nALLOY: AG 925"],
            ["CARAT", "N/A", "SOLID 925 SILVER\nNICKEL FREE"],
            ["ORIGIN", "USA / ITALY", "SOURCED GLOBALLY\nMADE IN USA & ITALY"],
            ["CRAFTSMANSHIP", "HAND FINISHED", "HAND POLISHED\nQUALITY INSPECTED"],
          ].map((row, index) => (
            <div className="material-spec" key={row[0]}>
              <span><small>{row[0]}</small><b>{row[1]}</b></span>
              <em>{row[2]}</em>
              <i className={`texture texture-${index}`} />
            </div>
          ))}
        </div>
      </section>
      <section className="ref-campaign">
        <img className="campaign-photo" src="/campaign-hero.jpg?v=2" alt="" />
        <div className="campaign-ticker" aria-hidden="true">
          <span>WE CUT THE FLUFF ::: WE CUT THE FLUFF ::: WE CUT THE FLUFF ::: WE CUT THE FLUFF ::: </span>
          <span>WE CUT THE FLUFF ::: WE CUT THE FLUFF ::: WE CUT THE FLUFF ::: WE CUT THE FLUFF ::: </span>
        </div>
        <button className="campaign-cta" type="button" onClick={() => go("shop")}>SIMPLE GOLD CHAINS</button>
      </section>
    </>
  );
}
