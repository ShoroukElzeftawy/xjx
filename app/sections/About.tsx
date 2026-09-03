import type { Go } from "../lib/types";

export function About({ go }: { go: Go }) {
  return (
    <>
      <section className="about-hero">
        <div>
          <p className="eyebrow">[ STUDIO / NEW YORK ]</p>
          <h1>FORM FOLLOWS<br /><i>STRUCTURE.</i></h1>
        </div>
        <div className="about-crop" />
      </section>
      <section className="manifesto">
        <p>01 / POSITION</p>
        <h2>WE MAKE JEWELRY<br />LIKE SMALL-SCALE<br /><span>ARCHITECTURE.</span></h2>
        <div>
          <p>XJEWELRYX is a direct-to-consumer bench in New York’s Diamond District. We do not sell romance. We sell engineered gold and structural design for self-sovereign buyers.</p>
          <p>No distributors. No retail brokers. No storefront markup. The work is gender-neutral, bold, and built to be worn hard.</p>
        </div>
      </section>
      <section className="values">
        <article>
          <span>01</span>
          <h3>DIRECT.</h3>
          <p>We respect your time. No jargon, no passive sentences.</p>
        </article>
        <article>
          <span>02</span>
          <h3>BOLD.</h3>
          <p>Not quiet accessories. Architectural weight.</p>
        </article>
        <article>
          <span>03</span>
          <h3>TRANSPARENT.</h3>
          <p>Materials, sourcing, and price logic in the open.</p>
        </article>
      </section>
      <section className="founder">
        <div className="founder-image" />
        <div>
          <p>02 / THE BENCH</p>
          <h2>47TH STREET.<br />NO MIDDLEMEN.</h2>
          <p>15 West 47th Street, Suite 802. Independent by scale. Accountable at every stage from metal to finish.</p>
          <button className="outline" onClick={() => go("shop")}>SEE THE OBJECTS ↗</button>
        </div>
      </section>
    </>
  );
}
