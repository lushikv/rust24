import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nextPackageDir = dirname(require.resolve("next/package.json"));
const nextBin = join(nextPackageDir, "dist/bin/next");
const wasmDir = join(projectRoot, "node_modules/@next/swc-wasm-nodejs");
const localNodeFallback = "/private/tmp/rust24-node";
const nodeBinary =
  process.env.RUST24_NODE_BINARY ??
  (existsSync(localNodeFallback) ? localNodeFallback : process.execPath);
const args = process.argv.slice(2);
const command = args[0] ?? "dev";
const normalizedArgs = [...args];

if ((command === "dev" || command === "build") && !normalizedArgs.includes("--webpack")) {
  normalizedArgs.push("--webpack");
}

const child = spawn(nodeBinary, [nextBin, ...normalizedArgs], {
  cwd: projectRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_TEST_WASM: "1",
    NEXT_TEST_WASM_DIR: wasmDir
  }
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
