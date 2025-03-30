export default defineNuxtConfig({
  nitro: {
    routeRules: {
      // Проксируем только API-запросы
      '/api-proxy/**': {
        proxy: 'http://localhost:8082/api/v1/**'
      }
    }
  },
  modules: [
    'usebootstrap'
    ],

  compatibilityDate: '2025-03-29'
})