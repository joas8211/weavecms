import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "pb_hooks/common",
    lib: {
      entry: "common/index.ts",
      formats: ["cjs"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["zod"],
    },
  },
});
