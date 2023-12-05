// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxtjs/robots',
    'nuxt-simple-sitemap',
    '@pinia/nuxt',
    
  ],
  css: ['@/assets/css/main.css'],

})
