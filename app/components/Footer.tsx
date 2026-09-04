import { SLOGAN } from "../lib/copy";
import type { Go } from "../lib/types";

export function Footer({ go }: { go: Go }) {
  return (
    <footer className="ref-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo" role="img" aria-label="XJEWELRYX" />
          <p>ENGINEERED IN CANADA.<br />{SLOGAN}.</p>
          <div className="socials">
            <a href="https://www.instagram.com" aria-label="Instagram">◎</a>
            <a href="https://www.tiktok.com" aria-label="TikTok">♪</a>
            <a href="https://www.youtube.com" aria-label="YouTube">▶</a>
          </div>
        </div>
        <div className="footer-links">
          <span>SHOP</span>
          <button onClick={() => go("shop")}>ALL</button>
          <button onClick={() => go("shop", undefined, { type: "RINGS" })}>RINGS</button>
          <button onClick={() => go("shop", undefined, { type: "EARRINGS" })}>EARRINGS</button>
          <button onClick={() => go("shop", undefined, { type: "BRACELETS" })}>BRACELETS</button>
          <button onClick={() => go("shop", undefined, { type: "NECKLACES" })}>NECKLACES</button>
          <button onClick={() => go("shop", undefined, { type: "CHAINS" })}>CHAINS</button>
        </div>
        <div className="footer-links">
          <span>CUSTOM</span>
          <button onClick={() => go("custom")}>BESPOKE</button>
          <button onClick={() => go("custom")}>ENGRAVING</button>
          <button onClick={() => go("custom")}>GALLERY</button>
        </div>
        <div className="footer-links">
          <span>ABOUT</span>
          <button onClick={() => go("about")}>OUR STORY</button>
          <button onClick={() => go("materials")}>MATERIALS</button>
          <button onClick={() => go("refer")}>REFER A FRIEND</button>
          <button onClick={() => go("about")}>FAQ</button>
        </div>
        <div className="footer-signup">
          <span>STAY CONNECTED</span>
          <p>SIGN UP FOR UPDATES AND<br />EXCLUSIVE ACCESS.</p>
          <form onSubmit={(event) => event.preventDefault()}>
            <label>
              <input placeholder="EMAIL ADDRESS" type="email" name="email" />
              <button type="submit" aria-label="Submit email">→</button>
            </label>
          </form>
        </div>
      </div>
      <div className="legal">
        <span>© XJEWELRYX 2024</span>
        <span>MADE IN CANADA</span>
        <span>TERMS　 PRIVACY　 SHIPPING & RETURNS</span>
      </div>
    </footer>
  );
}
