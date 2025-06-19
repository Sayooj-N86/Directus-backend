export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['leaflet/dist/leaflet.css'],
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:8055'
    }
  }
})
