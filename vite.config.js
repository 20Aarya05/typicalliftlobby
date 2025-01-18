import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000, // Change this if you have another service running on 3000
    open: true // Automatically open the browser on server start
  },
  build: {
    outDir: 'dist', // Output directory for the build
    chunkSizeWarningLimit: 1000, // Increase the chunk size limit to 1 MB (1000 KB)
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split react and react-dom into a vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor'; // Bundle react and react-dom into a single vendor chunk
          }
          // Optionally, you can also split other libraries or files here
          if (id.includes('src/utils')) {
            return 'utils'; // Split custom utils into a separate chunk
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src' // Optional: Short path for importing files
    }
  },
  publicDir: 'src',
});
