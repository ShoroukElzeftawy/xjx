"use client";

import { useEffect, useMemo, useState } from "react";

type Route = "home" | "shop" | "product" | "custom" | "materials" | "about";
type ProductItem = { name: string; price: string; type: string; tone: string; code: string; image?: string; images?: string[]; handle?: string; options?: string };

const products: ProductItem[] = [
  { name: "XJ4 — 10KT Thick Earrings", price: "$0.00 CAD", type: "EARRINGS", tone: "silver", code: "XJ4–01", handle: "xj4-10kt-thick-earrings", options: "1.67G", image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/1.67g_Model_1_800x800.jpg?v=1785932912", images: ["https://cdn.shopify.com/s/files/1/0808/2194/4571/files/1.67g_Model_1_800x800.jpg?v=1785932912", "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/1.67g_Product_2_800x800.png?v=1785932912"] },
  { name: "XJ4 — 10KT White Gold Thick Hoop", price: "$0.00 CAD", type: "EARRINGS", tone: "silver", code: "XJ4–02", handle: "xj4-10kt-white-gold-thick-hoop", options: "2.35G / 3.15G", image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/2.35g_Model_1_800x800.jpg?v=1785932003", images: ["https://cdn.shopify.com/s/files/1/0808/2194/4571/files/2.35g_Model_1_800x800.jpg?v=1785932003", "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/3.15g_Product_2_800x800.jpg?v=1785932045"] },
  { name: "XJ4 — 10KT Versace Thick Earrings", price: "$0.00 CAD", type: "EARRINGS", tone: "gold", code: "XJ4–03", handle: "xj4-10kt-versace-thick-earrings", options: "5.31G", image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/5.31g_Model_1_b0fcc55f-e41f-4462-9d44-69fdae394b27_800x800.jpg?v=1785930967", images: ["https://cdn.shopify.com/s/files/1/0808/2194/4571/files/5.31g_Model_1_b0fcc55f-e41f-4462-9d44-69fdae394b27_800x800.jpg?v=1785930967", "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/5.31g_Product_1_3ad0f463-e817-4762-b4d6-f55751d56ffd_800x800.jpg?v=1785930967"] },
  { name: "XJ4 — 10KT Versace Thin Earrings", price: "$0.00 CAD", type: "EARRINGS", tone: "gold", code: "XJ4–04", handle: "xj4-10kt-versace-thin-earrings", options: "4 WEIGHTS", image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/Model_1_800x800.jpg?v=1785929002", images: ["https://cdn.shopify.com/s/files/1/0808/2194/4571/files/Model_1_800x800.jpg?v=1785929002", "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/3.13g_Product_1_800x800.jpg?v=1785930155"] },
  { name: "18KT Gucci Chain", price: "$0.00 CAD", type: "NECKLACES", tone: "gold", code: "XJ1–01", handle: "18kt-gucci-4mm-4-5mm-6mm-8mm", options: "4MM / 4.5MM / 6MM / 8MM", image: "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/13_800x800.png?v=1777473725", images: ["https://cdn.shopify.com/s/files/1/0808/2194/4571/files/13_800x800.png?v=1777473725", "https://cdn.shopify.com/s/files/1/0808/2194/4571/files/7_800x800.png?v=1777473725"] },
];

const routeFromPath = (): Route => {
  if (typeof window === "undefined") return "home";
  const key = window.location.pathname.split("/").filter(Boolean)[0] as Route;
  return ["shop", "product", "custom", "materials", "about"].includes(key) ? key : "home";
};

export default function XjxSite() {
  const [route, setRoute] = useState<Route>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bag, setBag] = useState(0);
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<ProductItem>(products[0]);
  const [catalog, setCatalog] = useState<ProductItem[]>(products);
  const [collections, setCollections] = useState<string[]>(["EARRINGS", "NECKLACES"]);

  useEffect(() => {
    setRoute(routeFromPath());
    const pop = () => setRoute(routeFromPath());
    window.addEventListener("popstate", pop);
    fetch("/api/shopify").then(r => r.ok ? r.json() : null).then(data => {
      if (data?.products?.length) setCatalog(data.products);
      if (data?.collections?.length) setCollections(data.collections);
    }).catch(() => undefined);
    return () => window.removeEventListener("popstate", pop);
  }, []);

  const go = (next: Route) => {
    window.history.pushState({}, "", next === "home" ? "/" : `/${next}`);
    setRoute(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const add = (item = "Axis Ring 01") => {
    setBag((value) => value + 1);
    setNotice(`${item} added to bag`);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const openProduct = (item: ProductItem) => {
    setSelected(item);
    go("product");
  };

  return (
    <main className={`site-shell page-${route} ${route === "home" ? "reference-home" : "inner-page"}`}>
      <Header route={route} go={go} bag={bag} open={menuOpen} setOpen={setMenuOpen} />
      {route === "home" && <Home go={go} add={add} catalog={catalog} openProduct={openProduct} />}
      {route === "shop" && <Shop go={go} add={add} catalog={catalog} collections={collections} openProduct={openProduct} />}
      {route === "product" && <Product item={selected} add={add} go={go} />}
      {route === "custom" && <Custom />}
      {route === "materials" && <Materials />}
      {route === "about" && <About go={go} />}
      <Footer go={go} />
      {notice && <div className="toast" role="status">{notice}<span>VIEW BAG ↗</span></div>}
    </main>
  );
}

function Header({ route, go, bag, open, setOpen }: { route: Route; go: (r: Route) => void; bag: number; open: boolean; setOpen: (v: boolean) => void }) {
  const nav: [Route, string][] = [["shop", "SHOP"], ["custom", "CUSTOM"], ["materials", "MATERIALS"], ["about", "ABOUT"]];
  return <>
    <div className="signal"><span>COMPLIMENTARY SHIPPING ON ALL ORDERS</span><i>MADE IN NEW YORK</i><b>USD $⌄</b></div>
    <header>
      <button className="wordmark" onClick={() => go("home")} aria-label="X Jewelry X home"><span>OBJECTS / 2026</span></button>
      <nav>{nav.map(([key, label]) => <button key={key} className={route === key ? "active" : ""} onClick={() => go(key)}>{label}</button>)}</nav>
      <div className="tools"><button aria-label="Search">⌕</button><button>BAG [{bag}]</button><button className="menu" onClick={() => setOpen(!open)}>MENU</button></div>
    </header>
    {open && <div className="mobile-nav">{nav.map(([key, label], i) => <button key={key} onClick={() => go(key)}><span>0{i + 1}</span>{label}</button>)}</div>}
  </>;
}

function Home({ go, add, catalog, openProduct }: { go: (r: Route) => void; add: (n?: string) => void; catalog: ProductItem[]; openProduct: (p: ProductItem) => void }) {
  return <>
    <section className="ref-hero">
      <div className="hero-notes top">⌜<span>ENGINEERED<br/>IN NEW YORK.</span><small>40.7128° N, 74.0060° W</small>⌞</div>
      <div className="ref-hero-logo" role="img" aria-label="XJEWELRYX"></div>
      <div className="hero-notes bottom">⌜<span>BUILT WITHOUT<br/>THE MARKUP.</span>⌟</div>
      <div className="hero-ref">XJX–001</div>
    </section>
    <section className="ref-shop"><div className="ref-section-head"><h2>SHOP NEW</h2><button onClick={() => go("shop")}>VIEW ALL　→</button></div><ProductGrid items={catalog.slice(0, 3)} go={go} add={add} openProduct={openProduct} /></section>
    <section className="ref-manifesto"><h2>BUILT<br/>WITHOUT<br/>THE<br/>MARKUP.</h2><div className="manifesto-image" style={{backgroundImage:`url(${catalog[0]?.image})`}}></div><div className="blue-note">⌜<span>YOUNG.<br/>EXPERIENCED.<br/>BOLD.<br/>TRANSPARENT.</span>⌟</div><div className="gold-line"><b>XJX</b></div></section>
    <section className="ref-materials"><div className="material-intro"><h2>MATERIAL /<br/>WEIGHT /<br/>ORIGIN</h2><p>WE BELIEVE IN TOTAL TRANSPARENCY. EVERY PIECE IS CRAFTED WITH PRECISION, USING PREMIUM MATERIALS AND RESPONSIBLE SOURCING.</p><button onClick={() => go("materials")}>LEARN MORE　→</button></div><div className="material-table">{[["METAL","925 SILVER","92.5% PURE SILVER\nALLOY: AG 925"],["CARAT","N/A","SOLID 925 SILVER\nNICKEL FREE"],["ORIGIN","USA / ITALY","SOURCED GLOBALLY\nMADE IN USA & ITALY"],["CRAFTSMANSHIP","HAND FINISHED","HAND POLISHED\nQUALITY INSPECTED"]].map((r,i)=><div className="material-spec" key={r[0]}><span><small>{r[0]}</small><b>{r[1]}</b></span><em>{r[2]}</em><i className={`texture texture-${i}`}></i></div>)}</div></section>
  </>;
}

function Shop({ go, add, catalog, collections, openProduct }: { go: (r: Route) => void; add: (n?: string) => void; catalog: ProductItem[]; collections: string[]; openProduct: (p: ProductItem) => void }) {
  const [filter, setFilter] = useState("ALL");
  const filtered = useMemo(() => filter === "ALL" ? catalog : catalog.filter(p => p.type === filter), [filter, catalog]);
  return <>
    <section className="page-head"><p className="eyebrow">[ COLLECTION 01 / 2026 ]</p><h1>OBJECTS FOR<br/><i>THE BODY.</i></h1><p>{String(filtered.length).padStart(2, "0")} PIECES / RECYCLED METAL / MADE TO ORDER</p></section>
    <div className="filters">{["ALL", ...collections].map(x => <button className={filter === x ? "active" : ""} onClick={() => setFilter(x)} key={x}>{x}</button>)}<button className="sort">SORT: FEATURED ↓</button></div>
    <ProductGrid items={filtered} go={go} add={add} openProduct={openProduct} />
    <section className="shop-note"><span>NO. 01</span><h2>SMALL RUN.<br/>LONG LIFE.</h2><p>Every object is produced in limited quantities or made to order. This lets us control quality, reduce waste, and keep the process human.</p></section>
  </>;
}

function ProductGrid({ items, go, add, openProduct, title }: { items: ProductItem[]; go: (r: Route) => void; add: (n?: string) => void; openProduct: (p: ProductItem) => void; title?: string }) {
  return <section className="products">{title && <div className="section-title"><p>03 / SHOPIFY CATALOG</p><h2>{title}</h2><button onClick={() => go("shop")}>VIEW ALL ↗</button></div>}<div className="product-grid">{items.map((p) => <article className="product-card" key={p.code}><button className={`product-visual ${p.tone} has-image`} style={{ backgroundImage: `url(${p.image})` }} onClick={() => openProduct(p)} aria-label={`View ${p.name}`}><small>{p.code}<br/>SHOPIFY / ACTIVE</small></button><div className="product-info"><button onClick={() => openProduct(p)}><b>{p.name}</b><span>{p.type.replace(/S$/, "")} / {p.options}</span></button><div><b>{p.price}</b><button className="plus" onClick={() => add(p.name)}>＋</button></div></div></article>)}</div></section>;
}

function Product({ item, add, go }: { item: ProductItem; add: (n?: string) => void; go: (r: Route) => void }) {
  return <>
    <section className="product-page">
      <div className="product-gallery"><div className="gallery-main imported" style={{backgroundImage:`url(${item.images?.[0]})`}}><small>FRONT / {item.code}</small></div><div className="gallery-detail imported" style={{backgroundImage:`url(${item.images?.[1] || item.images?.[0]})`}}></div></div>
      <div className="buy-panel"><p className="eyebrow">{item.code} / {item.type.replace(/S$/, "")}</p><h1>{item.name}</h1><p className="price">{item.price} <span>SHOPIFY PRICE</span></p><p className="description">An original XJEWELRYX object, imported from the active Shopify catalog. Select the available size, weight, colour and length options at checkout.</p><fieldset><legend>AVAILABLE OPTIONS</legend><button className="selected">{item.options}</button></fieldset><button className="add" onClick={() => add(item.name)}>ADD TO BAG — {item.price} <b>↗</b></button><div className="specs"><span>CATALOG<br/><b>SHOPIFY ACTIVE</b></span><span>CATEGORY<br/><b>{item.type}</b></span><span>REFERENCE<br/><b>{item.code}</b></span></div></div>
    </section>
    <section className="detail-story"><p>01 / CONSTRUCTION</p><h2>ONE LINE.<br/><i>CONTROLLED FORCE.</i></h2><p>The Axis ring begins as a flat architectural profile. It is cut, bent, joined and finished until the seam disappears.</p></section>
    <section className="next-object"><p>RETURN TO COLLECTION</p><button onClick={() => go("shop")}>VIEW ALL OBJECTS <span>↗</span></button></section>
  </>;
}

function Custom() {
  const [step, setStep] = useState(1);
  return <>
    <section className="custom-hero"><div><p className="eyebrow">[ COMMISSION / ONE OF ONE ]</p><h1>YOUR IDEA.<br/><i>ENGINEERED.</i></h1><p>A direct collaboration to create a piece with its own logic, weight and history.</p></div><div className="blueprint"><span className="draft-ring"></span><small>PROPOSAL STUDY<br/>SECTION A–A</small></div></section>
    <section className="process"><div className="section-title"><p>01 / PROCESS</p><h2>FOUR POINTS<br/>FROM IDEA TO OBJECT.</h2></div><div className="process-grid">{[["01","BRIEF","Tell us the story, function and feeling."],["02","DESIGN","We translate it into form and material."],["03","REFINE","You review scale, finish and detail."],["04","MAKE","The final object is formed and finished by hand."]].map(x => <article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></section>
    <section className="commission"><div><p>02 / START A COMMISSION</p><h2>BEGIN WITH<br/>WHAT YOU KNOW.</h2><p>You do not need a finished concept. A memory, material, sketch or single sentence is enough.</p></div><form onSubmit={(e) => { e.preventDefault(); setStep(2); }}><label>YOUR NAME<input required placeholder="FULL NAME" /></label><label>EMAIL<input required type="email" placeholder="YOU@EMAIL.COM" /></label><label>OBJECT TYPE<select><option>RING</option><option>NECKLACE</option><option>BRACELET</option><option>OTHER</option></select></label><label>THE IDEA<textarea placeholder="TELL US WHAT YOU ARE IMAGINING…" /></label><button className="add" type="submit">{step === 1 ? "SEND THE BRIEF ↗" : "BRIEF RECEIVED — THANK YOU"}</button></form></section>
  </>;
}

function Materials() {
  return <>
    <section className="materials-hero"><div><p className="eyebrow">[ MATERIALS / TRANSPARENCY ]</p><h1>NOTHING<br/><i>TO HIDE.</i></h1><p>What an object is made from matters as much as how it looks. Here is the system behind every XJEWELRYX piece.</p></div><div className="metal-disc"><span>AG</span><small>47<br/>SILVER</small></div></section>
    <section className="material-row"><span>01 / METAL</span><h2>RECYCLED<br/>925 SILVER</h2><div><p>Our sterling silver is sourced from certified recycled supply. Existing metal is refined and returned to circulation without compromising quality.</p><dl><dt>RECYCLED CONTENT</dt><dd>100%</dd><dt>STANDARD</dt><dd>925</dd><dt>RECYCLABLE</dt><dd>∞</dd></dl></div></section>
    <section className="material-row pale"><span>02 / GOLD</span><h2>RECYCLED<br/>18K GOLD</h2><div><p>Gold objects are cast using recycled 18-karat alloy. We work in small batches, keeping material use exact and recoverable.</p><dl><dt>FINENESS</dt><dd>750</dd><dt>TRACEABILITY</dt><dd>VERIFIED</dd></dl></div></section>
    <section className="material-row blue"><span>03 / STONES</span><h2>CHOSEN FOR<br/>CHARACTER.</h2><div><p>We prioritize reclaimed, traceable and lab-grown stones. Each is selected for proportion and presence—not artificial perfection.</p><dl><dt>SOURCING</dt><dd>DISCLOSED</dd><dt>SETTING</dt><dd>BY HAND</dd></dl></div></section>
    <section className="care"><p>04 / KEEP IT MOVING</p><h2>REPAIR. RESIZE.<br/>RETURN.</h2><p>Objects should change with the people who wear them. We offer repair, refinishing and recycling support for every XJEWELRYX piece.</p></section>
  </>;
}

function About({ go }: { go: (r: Route) => void }) {
  return <>
    <section className="about-hero"><div><p className="eyebrow">[ STUDIO / CAIRO + BERLIN ]</p><h1>FORM FOLLOWS<br/><i>FEELING.</i></h1></div><div className="about-crop"></div></section>
    <section className="manifesto"><p>01 / POSITION</p><h2>WE MAKE JEWELRY<br/>LIKE SMALL-SCALE<br/><span>ARCHITECTURE.</span></h2><div><p>XJEWELRYX began with a question: what if jewelry was treated as structure rather than ornament?</p><p>Our work balances exact geometry with the evidence of the hand. The result is direct, tactile and designed to gain meaning through use.</p></div></section>
    <section className="values"><article><span>01</span><h3>REDUCE THE NOISE.</h3><p>Every line must have a reason.</p></article><article><span>02</span><h3>SHOW THE PROCESS.</h3><p>Transparency is part of the design.</p></article><article><span>03</span><h3>MAKE IT LAST.</h3><p>Material, form and care extend an object’s life.</p></article></section>
    <section className="founder"><div className="founder-image"></div><div><p>02 / THE STUDIO</p><h2>DESIGNED BETWEEN<br/>INSTINCT + SYSTEM.</h2><p>Independent by scale and collaborative by nature, the studio works with specialist makers to keep every stage close, considered and accountable.</p><button className="outline" onClick={() => go("shop")}>SEE THE OBJECTS ↗</button></div></section>
  </>;
}

function Marquee() { return <div className="marquee"><span>RECYCLED METAL ✕ BUILT TO LAST ✕ MADE WITH INTENT ✕ RECYCLED METAL ✕ BUILT TO LAST ✕ MADE WITH INTENT ✕</span></div>; }

function Footer({ go }: { go: (r: Route) => void }) {
  return <footer className="ref-footer"><div className="footer-main"><div className="footer-brand"><div className="footer-logo" role="img" aria-label="X Jewelry X"></div><p>ENGINEERED IN NEW YORK.<br/>BUILT WITHOUT THE MARKUP.</p><div className="socials"><a aria-label="Instagram">◎</a><a aria-label="TikTok">♪</a><a aria-label="YouTube">▶</a></div></div><div className="footer-links"><span>SHOP</span><button onClick={() => go("shop")}>NEW ARRIVALS</button><button onClick={() => go("shop")}>RINGS</button><button onClick={() => go("shop")}>CHAINS</button><button onClick={() => go("shop")}>EARRINGS</button><button onClick={() => go("shop")}>BRACELETS</button></div><div className="footer-links"><span>CUSTOM</span><button onClick={() => go("custom")}>BESPOKE</button><button onClick={() => go("custom")}>ENGRAVING</button><button onClick={() => go("custom")}>GALLERY</button></div><div className="footer-links"><span>ABOUT</span><button onClick={() => go("about")}>OUR STORY</button><button onClick={() => go("materials")}>MATERIALS</button><button onClick={() => go("about")}>CARE</button><button onClick={() => go("about")}>FAQ</button></div><div className="footer-signup"><span>STAY CONNECTED</span><p>SIGN UP FOR UPDATES AND<br/>EXCLUSIVE ACCESS.</p><label><input placeholder="EMAIL ADDRESS" type="email"/><button aria-label="Submit email">→</button></label></div></div><div className="legal"><span>© XJEWELRYX 2026</span><span>MADE IN NEW YORK</span><span>TERMS　 PRIVACY　 SHIPPING & RETURNS</span></div></footer>;
}
