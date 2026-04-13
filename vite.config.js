import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This exposes the project on the local network IP
    port: 8000, // Replace 3000 with your desired port number
    strictPort: true, // Optional: set to true if you want Vite to fail if the port is already in use
  },
});
