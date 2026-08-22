import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'josebatista.dev',
  description: 'Linux OS Portfolio',
  srcDir: 'src',
  cleanUrls: true,
  appearance: false,
  markdown: {
    theme: 'github-dark',
  },
  sitemap: {
    hostname: 'https://josebatista.dev',
  },
  head: [
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' }]
  ],
  themeConfig: {}
})
