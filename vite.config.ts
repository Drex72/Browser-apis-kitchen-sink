import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// @ts-ignore
import Inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-ignore
  plugins: [react(), Inspect()],
});
