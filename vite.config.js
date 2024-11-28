import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
  };
});
