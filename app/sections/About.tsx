import type { Go, ProductItem } from "../lib/types";

function src(catalog: ProductItem[], index: number, which: "model" | "product", fallback: string) {
  const item = catalog[index];
  if (!item) return fallback;
  if (which === "product" && item.images?.[1]) return item.images[1];
  return item.image || item.images?.[0] || fallback;
}

export function About({ go, catalog }: { go: Go; catalog: ProductItem[] }) {
  const hoop = src(catalog, 0, "model", "/landing-hero.jpg");
  const hoopProduct = src(catalog, 0, "product", hoop);
  const whiteHoop = src(catalog, 1, "model", hoop);
  const versace = src(catalog, 2, "model", hoop);
  const versaceProduct = src(catalog, 2, "product", versace);
  const thinModel = src(catalog, 3, "model", whiteHoop);
  const thinProduct = src(catalog, 3, "product", versaceProduct);
  const chain = src(catalog, 4, "model", "/campaign-hero.jpg");
  const chainDetail = src(catalog, 4, "product", chain);

  return (
    <>
      <section className="origin-block">
        <p className="frame-label">OUR ORIGIN</p>
        <div className="origin-track" aria-hidden="true">
          <span>ORIGIN</span>
          <span>NOW</span>
          <span>NEXT</span>
        </div>
        <div className="origin-grid">
          <article>
            <small>ORIGIN</small>
            <h3>THE DISTRICT.</h3>
            <p>We work where jewelry has been made for decades. Surrounded by skill, history, and precision.</p>
            <div className="about-shot" style={{ backgroundImage: `url(/landing-hero.jpg)` }} />
          </article>
          <article>
            <small>NOW</small>
            <h3>OUR BENCH.</h3>
            <p>Every piece is designed and handcrafted in-house with modern tools and old-school discipline.</p>
            <div className="about-shot" style={{ backgroundImage: `url(${versace})` }} />
          </article>
          <article>
            <small>NEXT</small>
            <h3>YOUR STORY.</h3>
            <p>Built to last. Made to mean something. Designed to be worn, not just owned.</p>
            <div className="about-shot" style={{ backgroundImage: `url(${whiteHoop})` }} />
          </article>
        </div>
      </section>

      <section className="cut-middle">
        <div>
          <h2>CUT THE<br />MIDDLE.</h2>
          <p>We source the best materials, craft everything in-house, and sell directly to you. Better quality. Better price. No extra layers.</p>
        </div>
        <div>
          <p className="cut-flow">SOURCE → BENCH → YOU</p>
          <div className="cut-grid">
            <figure>
              <div className="about-shot" style={{ backgroundImage: `url(${chainDetail})` }} />
              <figcaption><b>PREMIUM MATERIALS</b><span>ETHICALLY SOURCED</span></figcaption>
            </figure>
            <figure>
              <div className="about-shot" style={{ backgroundImage: `url(${thinModel})` }} />
              <figcaption><b>IN-HOUSE DESIGN</b><span>HANDCRAFTED</span></figcaption>
            </figure>
            <figure>
              <div className="about-shot" style={{ backgroundImage: `url(/campaign-hero.jpg)` }} />
              <figcaption><b>FAIR PRICES</b><span>NO MIDDLE MARKUP</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="craft-block">
        <p className="frame-label inverse">OUR CRAFT</p>
        <div className="craft-grid">
          <article>
            <div className="about-shot" style={{ backgroundImage: `url(${hoopProduct})` }} />
            <h3>HANDCRAFTED</h3>
            <p>Skilled hands. Real tools. Real craftsmanship.</p>
          </article>
          <article>
            <div className="about-shot" style={{ backgroundImage: `url(${versaceProduct})` }} />
            <h3>ENGINEERED</h3>
            <p>Designed with precision. Built to wear every day.</p>
          </article>
          <article>
            <div className="about-shot" style={{ backgroundImage: `url(${thinProduct})` }} />
            <h3>FINISHED</h3>
            <p>Polished to perfection. Inspected. Every time.</p>
          </article>
        </div>
        <button className="outline" onClick={() => go("shop")}>SEE THE OBJECTS ↗</button>
      </section>
    </>
  );
}
