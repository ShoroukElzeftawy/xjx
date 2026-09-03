import type { Go } from "../lib/types";

export function Footer({ go }: { go: Go }) {
  return (
    <footer className="ref-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo" role="img" aria-label="XJEWELRYX" />
          <p>15 WEST 47TH STREET, SUITE 802<br />NEW YORK, NY 10036<br />ENGINEERED ON 47TH STREET.</p>
          <a className="footer-mail" href="mailto:hello@xjewelryx.com">hello@xjewelryx.com</a>
          <div className="socials">
            <a href="https://www.instagram.com" aria-label="Instagram">◎</a>
            <a href="https://www.tiktok.com" aria-label="TikTok">♪</a>
            <a href="https://www.youtube.com" aria-label="YouTube">▶</a>
          </div>
        </div>
        <div className="footer-links">
          <span>SHOP</span>
          <button onClick={() => go("shop")}>NEW ARRIVALS</button>
          <button onClick={() => go("shop")}>EARRINGS</button>
          <button onClick={() => go("shop")}>CHAINS</button>
          <button onClick={() => go("shop")}>RINGS</button>
        </div>
        <div className="footer-links">
          <span>CUSTOM</span>
          <button onClick={() => go("custom")}>COMMISSION</button>
          <button onClick={() => go("custom")}>ENGRAVING</button>
        </div>
        <div className="footer-links">
          <span>ABOUT</span>
          <button onClick={() => go("about")}>THE BENCH</button>
          <button onClick={() => go("materials")}>MATERIALS</button>
          <button onClick={() => go("about")}>CARE</button>
        </div>
        <div className="footer-signup">
          <span>STAY CONNECTED</span>
          <p>UPDATES WITH DATA, NOT ROMANCE.</p>
          <form onSubmit={(event) => event.preventDefault()}>
            <label>
              <input placeholder="EMAIL ADDRESS" type="email" name="email" />
              <button type="submit" aria-label="Submit email">→</button>
            </label>
          </form>
        </div>
      </div>
      <div className="legal">
        <span>© XJEWELRYX 2026</span>
        <span>NY XJX · DIAMOND DISTRICT</span>
        <span>TERMS　 PRIVACY　 SHIPPING</span>
      </div>
    </footer>
  );
}
