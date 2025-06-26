export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],

  tailwindcss: {

  },

  

  runtimeConfig:{

    mongodburi: process.env.MONGO_URI

  },

  compatibilityDate: '2025-04-16'
})