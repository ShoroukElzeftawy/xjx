import { mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import vinext from "vinext";
import { defineConfig, type Plugin } from "vite";
import { sites } from "./build/sites-vite-plugin";

const require = createRequire(import.meta.url);

function reactRefreshRuntime(): Plugin {
  const runtimePath = join(dirname(require.resolve("@vitejs/plugin-react")), "refresh-runtime.js");
  const runtime = readFileSync(runtimePath, "utf-8").replace(
    /__README_URL__/g,
    "https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react",
  );
  return {
    name: "xjx-react-refresh-runtime",
    apply: "serve",
    enforce: "pre",
    resolveId(id) {
      if (id === "/@react-refresh") return id;
    },
    load(id) {
      if (id === "/@react-refresh") return runtime;
    },
  };
}

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

export default defineConfig(async () => {
  mkdirSync(".wrangler/logs", { recursive: true });
  mkdirSync(".wrangler/registry", { recursive: true });
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  return {
    server: {
      port: 3000,
      host: "localhost",
      strictPort: false,
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [reactRefreshRuntime(), vinext(), sites()],
  };
});
