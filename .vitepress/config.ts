import { defineConfig } from 'vitepress'
import { SITE_NAME, LOCALE_PT } from './theme/constants'

export default defineConfig({
  title: SITE_NAME,
  description: 'Linux OS Portfolio',
  srcDir: 'src',
  cleanUrls: true,
  srcExclude: [`**/${LOCALE_PT}/**`],
  appearance: false,
  markdown: {
    theme: 'github-dark',
  },
  sitemap: {
    hostname: `https://${SITE_NAME}`,
  },
  head: [
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' }]
  ],
  themeConfig: {}
})
