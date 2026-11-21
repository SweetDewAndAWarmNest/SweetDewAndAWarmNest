import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1536,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-ui': ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name?.split('.').pop();
          if (ext === 'css') return 'assets/[name]-[hash].css';
          return 'assets/[name]-[hash].[ext]';
        },
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-dom/client'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
    cssMinify: true,
    modulePreload: {
      polyfill: true,
    },
  },
  css: {
    devSourcemap: false,
    modules: {
      localsConvention: 'camelCase',
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
    exclude: ['@types/react', '@types/react-dom'],
  },
  resolve: {
    alias: {
      '@': '/src/frontend/src',
      '@components': '/src/frontend/src/components',
      '@utils': '/src/frontend/src/utils',
    },
  },
  json: {
    namedExports: true,
  },
  cache: {
    type: 'filesystem',
    maxSize: 1024 * 1024 * 512,
  },
  chunkSizeWarningLimit: 1536,
});
