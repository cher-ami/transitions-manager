import { defineConfig } from "tsup"

export default defineConfig({
  entry: { index: "src/index.ts" },
  splitting: false,
  clean: true,
  minify: true,
  dts: true,
  format: ["cjs", "esm"],
  name: "transitions-manager",
  external: ["@cher-ami/debug", "react", "react-dom"],
  sourcemap: true,
})
