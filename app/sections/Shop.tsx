"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "../components/ProductGrid";
import type { Go, ProductItem } from "../lib/types";

export function Shop({
  go,
  add,
  catalog,
  collections,
  openProduct,
}: {
  go: Go;
  add: (item: ProductItem) => void;
  catalog: ProductItem[];
  collections: string[];
  openProduct: (item: ProductItem) => void;
}) {
  const [filter, setFilter] = useState("ALL");
  const filtered = useMemo(
    () => (filter === "ALL" ? catalog : catalog.filter((item) => item.type === filter)),
    [filter, catalog],
  );

  return (
    <>
      <section className="page-head">
        <p className="eyebrow">[ COLLECTION 01 / 2026 ]</p>
        <h1>OBJECTS FOR<br /><i>THE BODY.</i></h1>
        <p>{String(filtered.length).padStart(2, "0")} PIECES / DIRECT FROM THE BENCH / MADE TO ORDER</p>
      </section>
      <div className="filters">
        {["ALL", ...collections].map((item) => (
          <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>
            {item}
          </button>
        ))}
      </div>
      <ProductGrid items={filtered} add={add} openProduct={openProduct} />
      <section className="shop-note">
        <span>NO. 01</span>
        <h2>SMALL RUN.<br />LONG LIFE.</h2>
        <p>Limited quantities or made to order. That keeps quality high, waste low, and the process human.</p>
      </section>
    </>
  );
}
