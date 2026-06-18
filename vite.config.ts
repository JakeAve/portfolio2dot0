import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    fresh(),
    tailwindcss(),
  ],
  // Ensure `three` and `three/addons/*` resolve to a single instance,
  // otherwise the addon's internal `import 'three'` gets a second copy
  // and the "Multiple instances of Three.js" warning fires.
  resolve: {
    dedupe: ["three"],
  },
  optimizeDeps: {
    include: ["three", "three/addons/controls/OrbitControls.js"],
  },
});
