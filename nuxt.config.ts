export default defineNuxtConfig({

  ssr: false,   // Отключаем SSR для упрощения работы с клиентскими библиотеками и для прямого доступа к DOM

  nitro: {
    routeRules: {
      // Проксируем только API-запросы
      '/api-proxy/**': {
        proxy: 'http://localhost:8083/api/v1/**'
      }
    }
  },
  modules: [
    'usebootstrap'
    ],

  compatibilityDate: '2025-03-29'
})