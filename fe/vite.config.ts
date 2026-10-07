import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(frontendRoot, "..");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, workspaceRoot, "");
  const authTarget = env.VITE_MAP_AUTH_URL || "http://localhost:3001";

  return {
    root: frontendRoot,
    envDir: workspaceRoot,
    plugins: [react()],
    optimizeDeps: { exclude: ["maplibre-gl"] },
    server: {
      proxy: {
        "/auth": { target: authTarget, changeOrigin: true },
        "/api/geodata": { target: env.VITE_GEODATA_API_URL || "http://localhost:8090", changeOrigin: true }
      }
    }
  };
});

