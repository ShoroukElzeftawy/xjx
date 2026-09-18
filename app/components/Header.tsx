"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "./Heart";
import { SkinToneSlider } from "./SkinToneSlider";
import { pathFor } from "../lib/routes";
import type { Route } from "../lib/types";

const nav: [Route, string][] = [
  ["shop", "SHOP"],
  ["materials", "MATERIALS"],
  ["about", "ABOUT"],
  ["refer", "REFER"],
];

export function Header({
  route,
  bag,
  saved,
  onBag,
  onSearch,
  solid,
}: {
  route: Route;
  bag: number;
  saved: number;
  onBag: () => void;
  onSearch: () => void;
  solid: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const stuck = solid || scrolled;

  const openSearch = () => {
    const toggle = document.getElementById("mobile-nav-toggle");
    if (toggle instanceof HTMLInputElement) toggle.checked = false;
    onSearch();
  };

  useEffect(() => {
    const readY = () => Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop);
    const update = () => setScrolled(readY() > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("scroll", update, { passive: true, capture: true });
    const hero = document.querySelector(".ref-hero");
    const io = hero
      ? new IntersectionObserver(([entry]) => {
          setScrolled(readY() > 24 || entry.boundingClientRect.bottom < 88);
        }, { threshold: [0, 0.15, 1] })
      : null;
    if (hero && io) io.observe(hero);
    return () => {
      window.removeEventListener("scroll", update);
      document.removeEventListener("scroll", update, { capture: true });
      io?.disconnect();
    };
  }, [route]);

  return (
    <div className="site-chrome">
      <input id="mobile-nav-toggle" className="mobile-nav-toggle" type="checkbox" aria-hidden="true" tabIndex={-1} />
      <header className={stuck ? "is-solid" : "is-overlay"}>
        <a className="wordmark" href={pathFor("home")} aria-label="XJEWELRYX home" tabIndex={stuck ? 0 : -1} />
        <nav>
          {nav.map(([key, label]) => (
            <a key={key} href={pathFor(key)} className={route === key ? "active" : ""}>
              {label}
            </a>
          ))}
        </nav>
        <div className="tools">
          <button type="button" className="tool-search" aria-label="Search" onClick={openSearch}>SEARCH</button>
          <a className={route === "account" ? "active" : ""} href={pathFor("account")}>ACCOUNT</a>
          <a className={`tool-heart${route === "saved" ? " active" : ""}`} href={pathFor("saved")} aria-label={`Saved [${saved}]`}>
            <HeartIcon filled={saved > 0} />
          </a>
          <label className="menu" htmlFor="mobile-nav-toggle">MENU</label>
          <button type="button" onClick={onBag}>BAG [{bag}]</button>
        </div>
      </header>
      <SkinToneSlider fixed inputId="nav-skin-tone" />
      <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile">
        <button type="button" onClick={openSearch}>
          <span>00</span>
          SEARCH
        </button>
        {nav.map(([key, label], index) => (
          <a key={key} href={pathFor(key)}>
            <span>0{index + 1}</span>
            {label}
          </a>
        ))}
        <a href={pathFor("saved")}>
          <span>0{nav.length + 1}</span>
          SAVED
        </a>
        <a href={pathFor("account")}>
          <span>0{nav.length + 2}</span>
          ACCOUNT
        </a>
      </nav>
    </div>
  );
}
