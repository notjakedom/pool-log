import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Removed dotenv import as we are directly defining the variables

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Directly define Supabase environment variables
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify("https://xjdqchitxqwwepkxwtxw.supabase.co"),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqZHFjaGl0eHF3d2Vwa3h3dHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MjA2NzgsImV4cCI6MjA3NDQ5NjY3OH0.s2IQy-_sp23cBOQkYIvaTkbAl2l9Tgc0UhhcmPE0aB4"),
  },
}));