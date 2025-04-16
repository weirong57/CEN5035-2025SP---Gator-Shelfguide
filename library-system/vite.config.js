/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})*/

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import vitePluginImp from 'vite-plugin-imp';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginImp({
      libList: [
        {
          libName: 'antd',
          style: (name) => `antd/es/${name}/style`
        }
      ]
    }),
    visualizer({
      open: true,
      filename: 'bundle-analysis.html'
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages')
    }
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: process.env.NODE_ENV !== 'production',
    cssCodeSplit: true,
    emptyOutDir: true,

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 按模块类型分块
          if (id.includes('AdminDashboard')) return 'admin';
          if (id.includes('/pages/')) {
            const match = id.match(/pages\/(\w+)\//);
            return match ? `page-${match[1].toLowerCase()}` : null;
          }
          if (id.includes('MainLayout')) return 'layout-main';
          if (id.includes('node_modules/antd')) return 'antd';
          if (id.includes('node_modules')) return 'vendor';
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'entries/[name]-[hash].js'
      },
      external: [
        /\.test\.jsx?$/,
        new RegExp(path.resolve(__dirname, 'src/tests'))
      ]
    }
  },

  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#1890ff' // 自定义Ant Design主题色
        }
      }
    }
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});