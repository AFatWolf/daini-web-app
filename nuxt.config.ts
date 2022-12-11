import { defineNuxtConfig } from 'nuxt'
import { resolve } from 'pathe'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@formkit/nuxt', '@vueuse/nuxt', 'nuxt-lodash'],
  css: ['@/assets/styles/custom.scss'],
  script: ['~/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'],
  ssr: false,
  runtimeConfig: {
    public: {
      meditatorPublicKey: process.env.MEDITATOR_PUBLIC_KEY
    }
  }
  // alias: {
  //   '~': resolve('.'),
  //   '@': resolve('.'),
  // },
})
