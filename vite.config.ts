import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    fresh(),
    tailwindcss(),
  ],
  // Collapse `three` and `three/addons/*` to a single instance so the addon's
  // internal `import 'three'` doesn't pull a second copy (the "Multiple
  // instances of Three.js" warning). NOTE: do not add `optimizeDeps.include`
  // here — Vite's dep optimizer is incompatible with Fresh's Deno loader and
  // makes dev 500 on `?v=` query paths (preact/debug, @prefresh/*).
  resolve: {
    dedupe: ["three"],
  },
});
