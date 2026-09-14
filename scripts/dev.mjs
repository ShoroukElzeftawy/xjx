import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const host = "127.0.0.1";
const port = 3001;
const root = dirname(fileURLToPath(import.meta.url));
const project = join(root, "..");

function isListening() {
  return new Promise((resolve) => {
    const socket = createConnection({ host, port }, () => {
      socket.end();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
  });
}

if (await isListening()) {
  console.log(`Already running: http://${host}:${port}/`);
  console.log("Open that URL. A second npm run dev is not needed.");
  process.exit(0);
}

const vite = spawn(
  join(project, "node_modules/.bin/vite"),
  ["--config", "vite.preview.config.ts", "--port", String(port), "--host", host],
  { stdio: "inherit", cwd: project },
);
vite.on("exit", (code) => process.exit(code ?? 1));
