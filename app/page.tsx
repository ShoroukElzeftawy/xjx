"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Cart } from "./components/Cart";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Search } from "./components/Search";
import { Toast } from "./components/Toast";
import { itemKey } from "./components/Heart";
import { fallbackProducts, productUrl } from "./lib/catalog";
import { pathFor, productFromHandle, routeFromPath } from "./lib/routes";
import type { BagLine, ProductItem, Route, ShopQuery } from "./lib/types";
import { About } from "./sections/About";
import { Account } from "./sections/Account";
import { Home } from "./sections/Home";
import { Materials } from "./sections/Materials";
import { Product } from "./sections/Product";
import { Refer } from "./sections/Refer";
import { Saved } from "./sections/Saved";
import { Shop } from "./sections/Shop";

const BAG_KEY = "xjx-bag";
const LIKES_KEY = "xjx-saved";

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
  const pathname = usePathname() || "/";
  const parsed = useMemo(() => routeFromPath(pathname), [pathname]);
  const route = parsed.route;
  const shopQuery = parsed.query ?? { type: "ALL", color: "ALL" };
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [catalog, setCatalog] = useState<ProductItem[]>(fallbackProducts);
  const [shopLive, setShopLive] = useState(false);
  const [selected, setSelected] = useState<ProductItem>(fallbackProducts[0]);
  const [bag, setBag] = useState<BagLine[]>([]);
  const [bagReady, setBagReady] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);
  const [likesReady, setLikesReady] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [headerSolid, setHeaderSolid] = useState(false);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      setHeaderSolid(route !== "home" || y > 36);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("scroll", update, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", update);
      document.removeEventListener("scroll", update, { capture: true });
    };
  }, [route]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(BAG_KEY);
      if (stored) setBag(JSON.parse(stored) as BagLine[]);
    } catch {
      undefined;
    }
    setBagReady(true);
    try {
      const storedLikes = window.localStorage.getItem(LIKES_KEY);
      if (storedLikes) setLikes(JSON.parse(storedLikes) as string[]);
    } catch {
      undefined;
    }
    setLikesReady(true);
  }, []);

  useEffect(() => {
    if (!bagReady) return;
    window.localStorage.setItem(BAG_KEY, JSON.stringify(bag));
  }, [bag, bagReady]);

  useEffect(() => {
    if (!likesReady) return;
    window.localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
  }, [likes, likesReady]);

  useEffect(() => {
    if (parsed.handle) {
      setSelected((current) => productFromHandle(catalog, parsed.handle) ?? current);
    }
  }, [catalog, parsed.handle]);

  useEffect(() => {
    fetch("/api/shopify")
      .then((response) => response.json())
      .then((data) => {
        if (data?.products?.length) {
          setCatalog(data.products);
          setShopLive(Boolean(data.connected));
          setSelected(productFromHandle(data.products, parsed.handle) ?? data.products[0]);
        }
      })
      .catch(() => undefined);
  }, [parsed.handle]);

  const go = (next: Route, handle?: string, query?: ShopQuery) => {
    const nextQuery = {
      type: query?.type || "ALL",
      color: query?.color || "ALL",
    };
    window.location.assign(pathFor(next, handle, nextQuery));
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

  const toggleLike = (item: ProductItem) => {
    const key = itemKey(item);
    if (!key) return;
    setLikes((current) => (current.includes(key) ? current.filter((entry) => entry !== key) : [...current, key]));
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
  const savedItems = catalog.filter((item) => likes.includes(itemKey(item)));
  const likeProps = { likedIds: likes, onToggleLike: toggleLike };

  return (
    <>
      <Header
        route={route}
        bag={count}
        saved={likes.length}
        onBag={() => setCartOpen(true)}
        onSearch={() => setSearchOpen(true)}
        solid={headerSolid}
      />
      <main className={`site-shell page-${route}${route === "home" ? "" : " inner-page"}`}>
      {route === "home" && <Home go={go} catalog={catalog} add={add} openProduct={openProduct} {...likeProps} />}
      {route === "shop" && <Shop go={go} add={add} catalog={catalog} query={shopQuery} openProduct={openProduct} live={shopLive} {...likeProps} />}
      {route === "product" && (!parsed.handle || selected.handle === parsed.handle) && (
        <Product item={selected} add={add} go={go} {...likeProps} />
      )}
      {route === "materials" && <Materials go={go} catalog={catalog} />}
      {route === "about" && <About />}
      {route === "refer" && <Refer />}
      {route === "saved" && <Saved items={savedItems} add={add} openProduct={openProduct} {...likeProps} />}
      {route === "account" && <Account />}
      <Footer go={go} />
      <Search
        open={searchOpen}
        catalog={catalog}
        onClose={() => setSearchOpen(false)}
        onPick={(item) => {
          setSearchOpen(false);
          openProduct(item);
        }}
      />
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
    </>
  );
}
