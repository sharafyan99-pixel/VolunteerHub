import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Every address that starts with /api is sent to the backend on port 3001
  server: { proxy: { '/api': 'http://localhost:3001' } }
});
