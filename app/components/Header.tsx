import type { Go, Route } from "../lib/types";

const nav: [Route, string][] = [
  ["shop", "SHOP"],
  ["custom", "CUSTOM"],
  ["materials", "MATERIALS"],
  ["about", "ABOUT"],
];

export function Header({
  route,
  go,
  bag,
  open,
  setOpen,
  onBag,
}: {
  route: Route;
  go: Go;
  bag: number;
  open: boolean;
  setOpen: (value: boolean) => void;
  onBag: () => void;
}) {
  return (
    <>
      <header>
        <button className="wordmark" onClick={() => go("home")} aria-label="XJEWELRYX home" />
        <nav>
          {nav.map(([key, label]) => (
            <button key={key} className={route === key ? "active" : ""} onClick={() => go(key)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="tools">
          <button type="button" aria-label="Search">⌕</button>
          <button type="button" onClick={onBag}>BAG [{bag}]</button>
          <button className="menu" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>MENU</button>
        </div>
      </header>
      {open && (
        <div className="mobile-nav" id="mobile-nav">
          {nav.map(([key, label], index) => (
            <button key={key} onClick={() => go(key)}>
              <span>0{index + 1}</span>
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
