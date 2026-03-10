// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ["@pinia/nuxt", "@nuxtjs/supabase", "@formkit/auto-animate", "@vite-pwa/nuxt"],
  supabase: {
    redirect: false
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Lista de Compras',
      short_name: 'Compras',
      description: 'Lista de compras compartida',
      lang: 'es',
      theme_color: '#54C147',
      background_color: '#eeeeee',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      icons: [
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      navigateFallback: null,
    },
    devOptions: {
      enabled: false,
    },
  },
})