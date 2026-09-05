"use client";

import { useEffect, useState } from "react";
import { pathFor } from "../lib/routes";
import type { Route } from "../lib/types";

const nav: [Route, string][] = [
  ["shop", "SHOP"],
  ["custom", "CUSTOM"],
  ["materials", "MATERIALS"],
  ["about", "ABOUT"],
  ["refer", "REFER"],
];

export function Header({
  route,
  bag,
  onBag,
  solid,
}: {
  route: Route;
  bag: number;
  onBag: () => void;
  solid: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const stuck = solid || scrolled;

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
          <button type="button" aria-label="Search">SEARCH</button>
          <label className="menu" htmlFor="mobile-nav-toggle">MENU</label>
          <button type="button" onClick={onBag}>BAG [{bag}]</button>
        </div>
      </header>
      <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile">
        {nav.map(([key, label], index) => (
          <a key={key} href={pathFor(key)}>
            <span>0{index + 1}</span>
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
