import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base public path
  base: '/',
  
  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'terser',
    target: 'es2020',
    
    // Asset handling
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    
    // Rollup options
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        offline: resolve(__dirname, 'public/offline.html')
      },
      output: {
        // Chunk splitting for better caching
        manualChunks: {
          vendor: ['web-vitals'],
          utils: ['src/utils/accessibility.js'],
          components: ['src/components/Navigation.js']
        },
        // Asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          
          return `${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    },
    
    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      },
      format: {
        comments: false
      }
    }
  },
  
  // Development server
  server: {
    port: 3000,
    host: 'localhost',
    open: true,
    cors: true,
    
    // Proxy for API calls (if needed)
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // Preview server (for production builds)
  preview: {
    port: 4173,
    host: 'localhost',
    open: true
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false
      }
    },
    postcss: {
      plugins: [
        // You can add PostCSS plugins here if needed
        // require('autoprefixer'),
        // require('cssnano')
      ]
    }
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: ['web-vitals'],
    exclude: []
  },
  
  // Plugin configuration
  plugins: [
    // Custom plugin for accessibility checking
    {
      name: 'accessibility-checker',
      configureServer(server) {
        server.middlewares.use('/a11y-check', (req, res, next) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            message: 'Accessibility checking endpoint',
            timestamp: new Date().toISOString()
          }));
        });
      }
    },
    
    // Custom plugin for PWA manifest
    {
      name: 'pwa-manifest',
      generateBundle() {
        // Ensure manifest.json is included in build
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: JSON.stringify({
            name: 'ONGConnect',
            short_name: 'ONGConnect',
            description: 'Modern accessible ONGConnect with WCAG 2.1 AA compliance',
            start_url: '/',
            display: 'standalone',
            background_color: '#1a365d',
            theme_color: '#2b77ad',
            orientation: 'portrait-primary',
            scope: '/',
            icons: [
              {
                src: '/images/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable any'
              },
              {
                src: '/images/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable any'
              }
            ],
            shortcuts: [
              {
                name: 'Search Books',
                short_name: 'Search',
                description: 'Search for books in our catalog',
                url: '/#search',
                icons: [{ src: '/images/search-icon.png', sizes: '96x96' }]
              },
              {
                name: 'Contact Us',
                short_name: 'Contact',
                description: 'Get in touch with our team',
                url: '/#contact',
                icons: [{ src: '/images/contact-icon.png', sizes: '96x96' }]
              }
            ],
            categories: ['books', 'education', 'shopping'],
            lang: 'pt-BR',
            dir: 'ltr'
          }, null, 2)
        });
      }
    }
  ],
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },
  
  // Experimental features
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` };
      }
      return { relative: true };
    }
  },
  
  // Worker configuration
  worker: {
    format: 'es'
  },
  
  // JSON handling
  json: {
    namedExports: true,
    stringify: false
  }
});
