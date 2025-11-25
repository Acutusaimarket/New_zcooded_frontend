import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// const ReactCompilerConfig = {
//   // Configuration options, e.g., target for React version
//   target: "19", // Set to '17', '18', or '19' based on your React version
//   // Other options can be added as needed, refer to documentation
// };

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
