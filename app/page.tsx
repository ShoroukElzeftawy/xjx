"use client";

import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Toast } from "./components/Toast";
import { fallbackProducts, productUrl } from "./lib/catalog";
import { pathFor, productFromHandle, routeFromPath } from "./lib/routes";
import type { BagLine, ProductItem, Route, ShopQuery } from "./lib/types";
import { About } from "./sections/About";
import { Custom } from "./sections/Custom";
import { Home } from "./sections/Home";
import { Materials } from "./sections/Materials";
import { Product } from "./sections/Product";
import { Refer } from "./sections/Refer";
import { Shop } from "./sections/Shop";

export default function XjxSite() {
  const [route, setRoute] = useState<Route>("home");
  const [shopQuery, setShopQuery] = useState<ShopQuery>({ type: "ALL", color: "ALL" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [catalog, setCatalog] = useState<ProductItem[]>(fallbackProducts);
  const [selected, setSelected] = useState<ProductItem>(fallbackProducts[0]);
  const [bag, setBag] = useState<BagLine[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const apply = () => {
      const next = routeFromPath();
      setRoute(next.route);
      setShopQuery(next.query ?? { type: "ALL", color: "ALL" });
      if (next.handle) setSelected((current) => productFromHandle(catalog, next.handle) ?? current);
    };
    apply();
    window.addEventListener("popstate", apply);
    fetch("/api/shopify")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.products?.length) {
          setCatalog(data.products);
          const { handle } = routeFromPath();
          setSelected(productFromHandle(data.products, handle));
        }
      })
      .catch(() => undefined);
    return () => window.removeEventListener("popstate", apply);
  }, []);

  const go = (next: Route, handle?: string, query?: ShopQuery) => {
    window.history.pushState({}, "", pathFor(next, handle, query));
    setRoute(next);
    setShopQuery(query ?? { type: "ALL", color: "ALL" });
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProduct = (item: ProductItem) => {
    setSelected(item);
    go("product", item.handle);
  };

  const add = (item: ProductItem, variantId = item.variantId) => {
    setBag((current) => {
      const match = current.find((line) => (variantId && line.variantId === variantId) || line.name === item.name);
      if (match) {
        return current.map((line) => (line === match ? { ...line, quantity: line.quantity + 1 } : line));
      }
      return [...current, { name: item.name, handle: item.handle, variantId, quantity: 1 }];
    });
    setNotice(`${item.name} added to bag`);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const checkout = async () => {
    if (checkingOut) return;
    const lines = bag.filter((line) => line.variantId).map((line) => ({
      merchandiseId: line.variantId as string,
      quantity: line.quantity,
    }));
    if (!lines.length) {
      window.open(productUrl(selected.handle), "_blank");
      return;
    }
    setCheckingOut(true);
    try {
      const response = await fetch("/api/shopify/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = await response.json() as { checkoutUrl?: string };
      window.location.href = data.checkoutUrl || productUrl(selected.handle);
    } catch {
      window.open(productUrl(selected.handle), "_blank");
    } finally {
      setCheckingOut(false);
    }
  };

  const count = bag.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <main className={`site-shell page-${route} ${route === "home" ? "reference-home" : "inner-page"}`}>
      <Header route={route} go={go} bag={count} open={menuOpen} setOpen={setMenuOpen} onBag={checkout} />
      {route === "home" && <Home go={go} add={add} catalog={catalog} openProduct={openProduct} />}
      {route === "shop" && <Shop go={go} add={add} catalog={catalog} query={shopQuery} openProduct={openProduct} />}
      {route === "product" && <Product item={selected} add={add} go={go} />}
      {route === "custom" && <Custom />}
      {route === "materials" && <Materials go={go} catalog={catalog} />}
      {route === "about" && <About go={go} catalog={catalog} />}
      {route === "refer" && <Refer />}
      <Footer go={go} />
      {notice && <Toast message={notice} onView={checkout} />}
    </main>
  );
}
