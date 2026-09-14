import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, relative, resolve, sep } from "node:path";

const host = "127.0.0.1";
const port = Number(process.env.PORT || 3000);
const root = resolve(process.cwd());
const publicDir = join(root, "public");
const stylesDir = join(root, "app", "styles");

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function safeJoin(base, requestPath) {
  const clean = decodeURIComponent(requestPath.split("?")[0]).replace(/^\/+/, "");
  const target = resolve(base, clean);
  const rel = relative(base, target);
  if (rel.startsWith("..") || rel.includes(`..${sep}`)) return null;
  return target;
}

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

function page() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>XJEWELRYX — Engineered in Canada</title>
  <link rel="icon" href="/brand-assets/logos/xjx-white-mark.png" />
  <link rel="stylesheet" href="/css/site.css" />
</head>
<body>
  <header class="is-solid">
    <a class="wordmark" href="/" aria-label="XJEWELRYX home"></a>
    <nav>
      <a href="/shop">SHOP</a>
      <a href="/custom">CUSTOM</a>
      <a href="/materials">MATERIALS</a>
      <a href="/about">ABOUT</a>
      <a href="/refer">REFER</a>
    </nav>
    <div class="tools">
      <a class="menu" href="/shop">SHOP</a>
      <span>BAG [0]</span>
    </div>
  </header>
  <main class="site-shell page-home">
    <section class="ref-hero">
      <p class="eyebrow">[ XJEWELRYX ]</p>
      <h1>HIGH QUALITY/<br />CUSTOMIZABLE JEWELRY</h1>
      <p>Local preview is running. Next.js was never opening a port on this Mac, so this lightweight server is serving the site files directly.</p>
      <p><a class="outline" href="/shop">SHOP</a></p>
    </section>
  </main>
</body>
</html>`;
}

const server = createServer((req, res) => {
  const urlPath = req.url?.split("?")[0] || "/";

  if (urlPath === "/css/site.css") {
    const files = [
      "base.css", "Header.css", "Hero.css", "Home.css", "Campaign.css", "Shop.css",
      "Product.css", "Custom.css", "Materials.css", "About.css", "Refer.css",
      "Footer.css", "Cart.css", "Toast.css",
    ];
    const css = files.map((file) => {
      const full = join(stylesDir, file);
      return existsSync(full) ? readFileSync(full, "utf8") : "";
    }).join("\n");
    send(res, 200, { "Content-Type": "text/css; charset=utf-8" }, css);
    return;
  }

  const asset = safeJoin(publicDir, urlPath);
  if (asset && existsSync(asset) && statSync(asset).isFile()) {
    res.writeHead(200, { "Content-Type": mime[extname(asset)] || "application/octet-stream" });
    createReadStream(asset).pipe(res);
    return;
  }

  send(res, 200, { "Content-Type": "text/html; charset=utf-8" }, page());
});

server.on("error", (error) => {
  if (error && error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
    console.error(`Open http://${host}:${port}/ — a preview is probably already running.`);
    console.error(`If you need a fresh start, stop the other process first, then run npm run dev again.`);
    process.exit(1);
  }
  throw error;
});

server.listen(port, host, () => {
  console.log(`Local: http://${host}:${port}/`);
});
