import { ReferralJoin } from "../components/ReferralJoin";

export function Refer() {
  return (
    <section className="refer-sheet">
      <div className="refer-lead">
        <div>
          <p>HOW IT PAYS</p>
          <h1>SHOPIFY +<br />REFERRALCANDY.</h1>
        </div>
        <ReferralJoin />
      </div>
      <ol className="refer-steps">
        <li>
          <span>01</span>
          <h2>JOIN.</h2>
          <p>Enter your email on the ReferralCandy page. That creates your unique link. This site does not mint codes.</p>
        </li>
        <li>
          <span>02</span>
          <h2>SHARE.</h2>
          <p>Send the link. Your friend takes the offer and pays on Shopify. Only that checkout counts.</p>
        </li>
        <li>
          <span>03</span>
          <h2>7.5% CASH.</h2>
          <p>After the order is paid, you get 7.5% via PayPal. Not a $50 coupon. Refunds can reverse it.</p>
        </li>
      </ol>
    </section>
  );
}
