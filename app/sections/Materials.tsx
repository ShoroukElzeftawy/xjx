import { SLOGAN } from "../lib/copy";
import type { Go, ProductItem } from "../lib/types";

function src(catalog: ProductItem[], index: number, which: "model" | "product", fallback: string) {
  const item = catalog[index];
  if (!item) return fallback;
  if (which === "product" && item.images?.[1]) return item.images[1];
  return item.image || item.images?.[0] || fallback;
}

export function Materials({ go, catalog }: { go: Go; catalog: ProductItem[] }) {
  const yellowModel = src(catalog, 0, "model", "/landing-hero.jpg");
  const yellowProduct = src(catalog, 0, "product", yellowModel);
  const whiteModel = src(catalog, 1, "model", yellowModel);
  const whiteProduct = src(catalog, 1, "product", whiteModel);
  const versaceProduct = src(catalog, 2, "product", yellowProduct);
  const thinModel = src(catalog, 3, "model", whiteModel);

  return (
    <>
      <section className="materials-hero">
        <div>
          <p className="eyebrow">[ MATERIALS / TRANSPARENCY ]</p>
          <h1>NOTHING<br /><i>TO HIDE.</i></h1>
          <p>{SLOGAN}. Metal, karat, color, and weight are part of the object. We publish them before you buy.</p>
        </div>
        <div className="materials-hero-shot" style={{ backgroundImage: `url(${yellowProduct})` }} />
      </section>

      <section className="mat-board">
        <p className="frame-label">01 / MATERIAL SYSTEM</p>
        <div className="mat-board-grid">
          {[
            ["METAL", "SOLID GOLD", "10KT live now. 18KT for heavier chain work when that family is split."],
            ["KARAT", "10KT / 18KT", "Karat is in the name and the SKU. Not a footnote after checkout."],
            ["COLOR", "YELLOW / WHITE / PINK", "Yellow and white are live on hoops. Pink is coming from the bench."],
            ["WEIGHT", "GRAMS, LISTED", "Every hoop is sold by weight. Size is compared to a dime or a hoop you already wear."],
          ].map(([label, value, note]) => (
            <article key={label}>
              <small>{label}</small>
              <h3>{value}</h3>
              <p>{note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mat-alloys">
        <div className="mat-alloys-copy">
          <p className="eyebrow">02 / ALLOYS</p>
          <h2>WHAT YOU<br />ARE BUYING.</h2>
          <p>Gold first. Color second. The object is the metal — not a plated skin over a mystery core.</p>
        </div>
        <div className="alloy-grid">
          <article>
            <div className="alloy-swatch yellow" />
            <div className="about-shot" style={{ backgroundImage: `url(${yellowModel})` }} />
            <h3>YELLOW GOLD</h3>
            <p>10KT. The warm standard on the current hoops. Reads gold in daylight and under shop lights.</p>
            <span>LIVE / XJ4</span>
          </article>
          <article>
            <div className="alloy-swatch white" />
            <div className="about-shot" style={{ backgroundImage: `url(${whiteModel})` }} />
            <h3>WHITE GOLD</h3>
            <p>10KT, cooler on skin. Same thick-hoop construction as yellow, in two weights.</p>
            <span>LIVE / XJ4–02</span>
          </article>
          <article>
            <div className="alloy-swatch pink" />
            <div className="about-shot" style={{ backgroundImage: `url(${thinModel})` }} />
            <h3>PINK GOLD</h3>
            <p>Same type-and-color system. Not listed until the bench has a run ready to sell.</p>
            <span>COMING FROM THE BENCH</span>
          </article>
        </div>
      </section>

      <section className="mat-build">
        <div>
          <p className="eyebrow inverse">03 / CONSTRUCTION</p>
          <h2>WEIGHED.<br />FINISHED.<br />CHECKED.</h2>
          <p>Hand polished. Quality inspected. Grams on the card, not a vague “heavy” or “light.”</p>
          <dl>
            <dt>FINISH</dt><dd>HAND POLISHED</dd>
            <dt>CORE</dt><dd>SOLID GOLD</dd>
            <dt>INSPECT</dt><dd>EVERY PIECE</dd>
            <dt>ORIGIN</dt><dd>CANADA</dd>
          </dl>
        </div>
        <div className="mat-build-shots">
          <div className="about-shot" style={{ backgroundImage: `url(${versaceProduct})` }} />
          <div className="about-shot" style={{ backgroundImage: `url(${whiteProduct})` }} />
          <div className="about-shot wide" style={{ backgroundImage: "url(/campaign-hero.jpg)" }} />
        </div>
      </section>

      <section className="material-row pale">
        <span>04 / STONES</span>
        <h2>ONLY WHEN<br />THE OBJECT<br />NEEDS THEM.</h2>
        <div>
          <p>Diamonds are sourced directly and set by hand when a piece uses them. Hoops on the floor now are metal-first. No glue-on sparkle to fill a photo.</p>
          <dl>
            <dt>SOURCING</dt><dd>DIRECT</dd>
            <dt>SETTING</dt><dd>BY HAND</dd>
            <dt>DEFAULT</dt><dd>GOLD ONLY</dd>
          </dl>
        </div>
      </section>

      <section className="mat-origin">
        <div className="about-shot" style={{ backgroundImage: "url(/landing-hero.jpg)" }} />
        <div>
          <p className="eyebrow">05 / ORIGIN</p>
          <h2>BASED IN<br />CANADA.</h2>
          <p>Designed, finished, and shipped from Canada. No extra storefront between the bench and you.</p>
          <dl>
            <dt>STUDIO</dt><dd>CANADA</dd>
            <dt>MAIL</dt><dd>HELLO@XJEWELRYX.COM</dd>
          </dl>
        </div>
      </section>

      <section className="care">
        <p>06 / KEEP IT MOVING</p>
        <h2>REPAIR. RESIZE.<br />RETURN.</h2>
        <div className="care-grid">
          <article>
            <h3>REPAIR</h3>
            <p>Solder, catch, hinge. Send it back to the bench that made it.</p>
          </article>
          <article>
            <h3>RESIZE</h3>
            <p>Compared against a piece you already wear, then adjusted. Not a chart in a vacuum.</p>
          </article>
          <article>
            <h3>REFINISH</h3>
            <p>Polish and inspect. Gold should look used, not ruined.</p>
          </article>
        </div>
        <button className="outline" onClick={() => go("shop")}>SEE THE OBJECTS ↗</button>
      </section>
    </>
  );
}
