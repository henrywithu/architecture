import { defineConfig } from "vite";
export default defineConfig({
  server: { host: "0.0.0.0" },
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/gsap/")) return "animation";
          if (id.includes("/node_modules/swiper/")) return "carousel";
        },
      },
    },
  },
  assetsInclude: ["**/*.glsl"],
});
