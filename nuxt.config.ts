import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@formkit/nuxt', '@vueuse/nuxt', 'nuxt-lodash'],
  css: [
    '@/assets/styles/custom.scss',
  ],
  script: [
    '~/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
  ],
  // plugins: [
  //   {
  //     src: '~/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
  //     mode: 'client',
  //   },
  // ],
})
