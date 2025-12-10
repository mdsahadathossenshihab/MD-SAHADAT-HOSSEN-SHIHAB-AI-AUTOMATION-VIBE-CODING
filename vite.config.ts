import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // FIX: In production (Vercel/Netlify), keys are in process.env, not loaded from .env file
  // We manually ensure API_KEY is passed if it exists in the system environment
  if (!env.API_KEY && process.env.API_KEY) {
    env.API_KEY = process.env.API_KEY;
  }

  return {
    plugins: [react()],
    define: {
      // JSON.stringify is important here so the object is inserted as a code literal
      'process.env': JSON.stringify(env)
    }
  };
});