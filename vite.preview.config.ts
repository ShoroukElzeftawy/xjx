import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

const root = dirname(fileURLToPath(import.meta.url));

function shopifyApi(): Plugin {
  return {
    name: "xjx-shopify-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split("?")[0] ?? "";
        try {
          if (req.method === "GET" && path === "/api/shopify") {
            const { fetchCatalog } = await import("./app/lib/shopify.ts");
            const data = await fetchCatalog("127.0.0.1");
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
            return;
          }
          if (req.method === "POST" && path === "/api/shopify/cart") {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(Buffer.from(chunk));
            const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}") as {
              lines?: { merchandiseId: string; quantity?: number }[];
            };
            const lines = (body.lines ?? [])
              .filter((line) => line.merchandiseId)
              .map((line) => ({ merchandiseId: line.merchandiseId, quantity: line.quantity ?? 1 }));
            const { createCheckout, variantPermalink } = await import("./app/lib/shopify.ts");
            if (!lines.length) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "No items to check out" }));
              return;
            }
            try {
              const cart = await createCheckout(lines, "127.0.0.1");
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ checkoutUrl: cart.checkoutUrl, quantity: cart.totalQuantity }));
            } catch (error) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({
                checkoutUrl: variantPermalink(lines[0].merchandiseId, lines[0].quantity),
                reason: error instanceof Error ? error.message : "Using Shopify cart permalink",
              }));
            }
            return;
          }
        } catch (error) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            connected: false,
            reason: error instanceof Error ? error.message : "Shopify unavailable",
          }));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, "");
  process.env.SHOPIFY_STORE_DOMAIN ??= env.SHOPIFY_STORE_DOMAIN;
  process.env.SHOPIFY_STOREFRONT_TOKEN ??= env.SHOPIFY_STOREFRONT_TOKEN;

  process.env.NEXT_PUBLIC_REFERRALCANDY_JOIN_URL ??= env.NEXT_PUBLIC_REFERRALCANDY_JOIN_URL;
  process.env.NEXT_PUBLIC_REFERRALCANDY_WIDGET_ID ??= env.NEXT_PUBLIC_REFERRALCANDY_WIDGET_ID;

  return {
    root: join(root, "preview"),
    envDir: root,
    envPrefix: ["VITE_", "NEXT_PUBLIC_"],
    publicDir: join(root, "public"),
    appType: "spa",
    plugins: [react(), shopifyApi()],
    resolve: {
      alias: {
        "next/navigation": join(root, "preview/shims/navigation.ts"),
      },
    },
    optimizeDeps: {
      holdUntilCrawlEnd: false,
      include: ["react", "react-dom", "react/jsx-runtime"],
    },
    server: {
      host: "127.0.0.1",
      port: 3001,
      strictPort: true,
      fs: { allow: [root] },
      watch: {
        ignored: ["**/xjx/**", "**/.git/**", "**/.wrangler/**"],
      },
    },
  };
});
