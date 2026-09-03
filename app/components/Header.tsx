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
        <nav>
          {nav.map(([key, label]) => (
            <button key={key} className={route === key ? "active" : ""} onClick={() => go(key)}>
              {label}
            </button>
          ))}
        </nav>
        <button className="wordmark" onClick={() => go("home")} aria-label="XJEWELRYX home" />
        <div className="tools">
          <button type="button" onClick={onBag}>BAG [{bag}]</button>
          <button className="menu" onClick={() => setOpen(!open)}>MENU</button>
        </div>
      </header>
      {open && (
        <div className="mobile-nav">
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
