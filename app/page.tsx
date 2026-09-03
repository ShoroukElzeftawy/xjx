"use client";

import { useEffect, useState } from "react";
import { Cart } from "./components/Cart";
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

const BAG_KEY = "xjx-bag";

function lineFromProduct(item: ProductItem, variantId?: string): BagLine {
  const variant = item.variants?.find((entry) => entry.id === variantId) ?? item.variants?.[0];
  return {
    name: item.name,
    handle: item.handle,
    variantId: variantId || item.variantId,
    quantity: 1,
    image: item.image || item.images?.[0],
    price: variant?.price ?? item.price,
    variantTitle: variant?.title,
    sku: variant?.sku || item.sku || item.code,
  };
}

export default function XjxSite() {
  const [route, setRoute] = useState<Route>("home");
  const [shopQuery, setShopQuery] = useState<ShopQuery>({ type: "ALL", color: "ALL" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [catalog, setCatalog] = useState<ProductItem[]>(fallbackProducts);
  const [shopLive, setShopLive] = useState(false);
  const [selected, setSelected] = useState<ProductItem>(fallbackProducts[0]);
  const [bag, setBag] = useState<BagLine[]>([]);
  const [bagReady, setBagReady] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(BAG_KEY);
      if (stored) setBag(JSON.parse(stored) as BagLine[]);
    } catch {
      undefined;
    }
    setBagReady(true);
  }, []);

  useEffect(() => {
    if (!bagReady) return;
    window.localStorage.setItem(BAG_KEY, JSON.stringify(bag));
  }, [bag, bagReady]);

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
      .then((response) => response.json())
      .then((data) => {
        if (data?.products?.length) {
          setCatalog(data.products);
          setShopLive(Boolean(data.connected));
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
    const incoming = lineFromProduct(item, variantId);
    setBag((current) => {
      const match = current.find((line) => (incoming.variantId && line.variantId === incoming.variantId) || line.name === item.name);
      if (match) {
        return current.map((line) => (line === match ? { ...line, quantity: line.quantity + 1 } : line));
      }
      return [...current, incoming];
    });
    setNotice(`${item.name} added to bag`);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const changeQty = (variantId: string, quantity: number) => {
    setBag((current) =>
      current
        .map((line) => ((line.variantId || line.name) === variantId ? { ...line, quantity } : line))
        .filter((line) => line.quantity > 0),
    );
  };

  const removeLine = (variantId: string) => {
    setBag((current) => current.filter((line) => (line.variantId || line.name) !== variantId));
  };

  const checkout = async () => {
    if (checkingOut) return;
    const lines = bag.filter((line) => line.variantId).map((line) => ({
      merchandiseId: line.variantId as string,
      quantity: line.quantity,
    }));
    if (!lines.length) {
      window.open(productUrl(bag[0]?.handle || selected.handle), "_blank");
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
    <main className={`site-shell page-${route}${route === "home" ? "" : " inner-page"}`}>
      <Header route={route} go={go} bag={count} open={menuOpen} setOpen={setMenuOpen} onBag={() => setCartOpen(true)} />
      {route === "home" && <Home go={go} add={add} catalog={catalog} openProduct={openProduct} />}
      {route === "shop" && <Shop go={go} add={add} catalog={catalog} query={shopQuery} openProduct={openProduct} live={shopLive} />}
      {route === "product" && <Product item={selected} add={add} go={go} />}
      {route === "custom" && <Custom />}
      {route === "materials" && <Materials go={go} catalog={catalog} />}
      {route === "about" && <About go={go} catalog={catalog} />}
      {route === "refer" && <Refer />}
      <Footer go={go} />
      <Cart
        open={cartOpen}
        lines={bag}
        checkingOut={checkingOut}
        onClose={() => setCartOpen(false)}
        onCheckout={checkout}
        onChangeQty={changeQty}
        onRemove={removeLine}
      />
      {notice && <Toast message={notice} onView={() => { setCartOpen(true); setNotice(""); }} />}
    </main>
  );
}
