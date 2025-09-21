import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:5174",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase the warning limit so legitimate large vendor chunks don't spam warnings
    chunkSizeWarningLimit: 1500,
    // Help Rollup split large dependencies into separate chunks for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react";
            if (id.includes("@radix-ui")) return "vendor-radix";
            if (id.includes("firebase")) return "vendor-firebase";
            if (id.includes("recharts")) return "vendor-recharts";
            if (id.includes("date-fns")) return "vendor-datefns";
            if (id.includes("@tanstack")) return "vendor-query";
            if (id.includes("react-router-dom")) return "vendor-router";
            if (id.includes("zod")) return "vendor-zod";
            if (id.includes("react-hook-form")) return "vendor-rhf";
            if (id.includes("lucide-react")) return "vendor-icons";
            // Fallback vendor chunk
            return "vendor";
          }
        },
      },
    },
  },
}));
