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
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  ],
  themeConfig: {}
})
