import { SLOGAN } from "../lib/copy";
import { pathFor } from "../lib/routes";
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
          <a href={pathFor("shop")} onClick={(event) => { event.preventDefault(); go("shop"); }}>ALL</a>
          <a href={pathFor("shop", undefined, { type: "RINGS" })} onClick={(event) => { event.preventDefault(); go("shop", undefined, { type: "RINGS" }); }}>RINGS</a>
          <a href={pathFor("shop", undefined, { type: "EARRINGS" })} onClick={(event) => { event.preventDefault(); go("shop", undefined, { type: "EARRINGS" }); }}>EARRINGS</a>
          <a href={pathFor("shop", undefined, { type: "BRACELETS" })} onClick={(event) => { event.preventDefault(); go("shop", undefined, { type: "BRACELETS" }); }}>BRACELETS</a>
          <a href={pathFor("shop", undefined, { type: "NECKLACES" })} onClick={(event) => { event.preventDefault(); go("shop", undefined, { type: "NECKLACES" }); }}>NECKLACES</a>
          <a href={pathFor("shop", undefined, { type: "CHAINS" })} onClick={(event) => { event.preventDefault(); go("shop", undefined, { type: "CHAINS" }); }}>CHAINS</a>
        </div>
        <div className="footer-links">
          <span>CUSTOM</span>
          <a href={pathFor("custom")} onClick={(event) => { event.preventDefault(); go("custom"); }}>BESPOKE</a>
          <a href={pathFor("custom")} onClick={(event) => { event.preventDefault(); go("custom"); }}>ENGRAVING</a>
          <a href={pathFor("custom")} onClick={(event) => { event.preventDefault(); go("custom"); }}>GALLERY</a>
        </div>
        <div className="footer-links">
          <span>ABOUT</span>
          <a href={pathFor("about")} onClick={(event) => { event.preventDefault(); go("about"); }}>OUR STORY</a>
          <a href={pathFor("materials")} onClick={(event) => { event.preventDefault(); go("materials"); }}>MATERIALS</a>
          <a href={pathFor("refer")} onClick={(event) => { event.preventDefault(); go("refer"); }}>REFER A FRIEND</a>
          <a href={pathFor("about")} onClick={(event) => { event.preventDefault(); go("about"); }}>FAQ</a>
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
