"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { shopProducts } from "../lib/catalog";
import { listingGallery } from "../lib/product-options";
import type { ProductItem } from "../lib/types";

export function Search({
  open,
  catalog,
  onClose,
  onPick,
}: {
  open: boolean;
  catalog: ProductItem[];
  onClose: () => void;
  onPick: (item: ProductItem) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const listed = shopProducts(catalog);
    const needle = query.trim().toLowerCase();
    if (!needle) return listed.slice(0, 8);
    return listed.filter((item) =>
      [item.name, item.type, item.color, item.sku, item.code, item.handle, item.options]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [catalog, query]);

  if (!open) return null;

  return (
    <div className="search-layer">
      <button className="search-scrim" type="button" aria-label="Close search" onClick={onClose} />
      <aside className="search-panel" role="dialog" aria-label="Search">
        <div className="search-head">
          <p>SEARCH</p>
          <button type="button" onClick={onClose}>CLOSE</button>
        </div>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="SEARCH PIECES"
          aria-label="Search pieces"
          autoComplete="off"
        />
        {results.length ? (
          <ul className="search-results">
            {results.map((item) => {
              const photo = listingGallery(item, "model")[0];
              return (
                <li key={item.code}>
                  <button type="button" onClick={() => onPick(item)}>
                    <span className="search-thumb" style={photo ? { backgroundImage: `url(${photo})` } : undefined} />
                    <span>
                      <b>{item.name}</b>
                      <em>{item.price}</em>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="search-empty">Nothing matches that search.</p>
        )}
      </aside>
    </div>
  );
}
