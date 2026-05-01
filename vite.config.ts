import { defineConfig } from 'vite';
import angular from '@vitejs/plugin-angular';

export default defineConfig({
  plugins: [
    angular(),
    {
      name: 'suppress-dynamic-import-warning',
      apply: 'serve',
      enforce: 'post',
      configResolved(config) {
        const originalWarn = config.logger.warn;
        config.logger.warn = (msg, options) => {
          if (typeof msg === 'string' && msg.includes('The above dynamic import cannot be analyzed by Vite')) {
            return;
          }
          originalWarn(msg, options);
        };
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'module-federation': ['@angular-architects/module-federation']
        }
      }
    }
  },
  server: {
    middlewareMode: true
  },
  optimizeDeps: {
    include: ['@angular-architects/module-federation']
  },
  resolve: {
    alias: {
      '@angular-architects/module-federation': '@angular-architects/module-federation'
    }
  },
  ssr: {
    noExternal: ['@angular-architects/module-federation']
  }
});
