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
    config(md) {
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const info = token.info.trim().split(/\s+/)[0]
        if (info === 'mermaid') {
          const code = token.content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
          return `<div class="mermaid">${code}</div>\n`
        }
        // VitePress 1.6 always injects copy/language controls around Shiki
        // fences. This site supplies its own code-block UI, so remove that
        // wrapper instead of leaving invisible controls in the document flow.
        return fence(tokens, idx, options, env, self)
          .replace(/^<div class="language-[^"]*"><button\b[^>]*><\/button><span class="lang">[^<]*<\/span>/, '')
          .replace(/<\/div>\n?$/, '')
      }
    },
  },
  sitemap: {
    hostname: `https://${SITE_NAME}`,
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  ],
  themeConfig: {}
})
