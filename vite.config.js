import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

// vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    define: {
      "process.env.DB_ADMIN_USERNAME": JSON.stringify(
        process.env.DB_ADMIN_USERNAME
      ),
      "process.env.DB_ADMIN_PASSWORD": JSON.stringify(
        process.env.DB_ADMIN_PASSWORD
      ),
    },
    plugins: [react()],
  };
});
