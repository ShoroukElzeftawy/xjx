import { shopifyStoreUrl } from "../lib/catalog";

export function Refer() {
  return (
    <>
      <section className="about-hero refer-hero">
        <div>
          <p className="eyebrow">[ REFERRAL / 7.5% ]</p>
          <h1>BRING SOMEONE<br /><i>IN.</i></h1>
          <p>Account holders get a unique code. When someone buys with it, you earn 7.5%. Codes, linking, and payout run through Shopify — not a side system on this site.</p>
        </div>
        <div className="about-crop" />
      </section>
      <section className="values">
        <article>
          <span>01</span>
          <h3>ACCOUNT.</h3>
          <p>Create a store account. That identity is what the unique code attaches to.</p>
        </article>
        <article>
          <span>02</span>
          <h3>CODE.</h3>
          <p>Your code is yours alone. Share it. Purchases that use it are the ones that count.</p>
        </article>
        <article>
          <span>03</span>
          <h3>7.5%.</h3>
          <p>Commission is 7.5% of the referred order. Payout and fraud checks stay in Shopify and the referral app we connect to it.</p>
        </article>
      </section>
      <section className="refer-close">
        <p>HOW IT PAYS</p>
        <h2>NO HOMEMADE<br />LEDGER.</h2>
        <p>We will not generate codes in the browser or track commissions on this website. That creates duplicate accounts, fake referrals, and a payout process we cannot audit.</p>
        <p>Shopify customer accounts plus a referral or discount app keep the code unique, the order linked, and the 7.5% payable through the same checkout you already use.</p>
        <a className="outline" href={`${shopifyStoreUrl}/account/register`} target="_blank" rel="noreferrer">
          OPEN A STORE ACCOUNT →
        </a>
      </section>
    </>
  );
}
