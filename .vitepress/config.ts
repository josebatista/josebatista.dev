import { defineConfig } from 'vitepress'
import { SITE_NAME, LOCALE_EN, LOCALE_PT, PREFIX_EN, PREFIX_PT } from './theme/constants'

const descriptions = {
  en: "José Batista's portfolio and technical blog about Apache Flink, distributed systems, observability, Android, and software engineering.",
  pt: 'Portfólio e blog técnico de José Batista sobre Apache Flink, sistemas distribuídos, observabilidade, Android e engenharia de software.',
}

const themeInitScript = `(() => {
  try {
    const saved = localStorage.getItem('josebatista-theme')
    const theme = saved === 'dark' || saved === 'light'
      ? saved
      : matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', theme)
  } catch (_) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})()`

export default defineConfig({
  title: SITE_NAME,
  description: descriptions.en,
  srcDir: 'src',
  cleanUrls: true,
  locales: {
    [PREFIX_EN]: {
      label: 'English',
      lang: LOCALE_EN,
      description: descriptions.en,
    },
    [PREFIX_PT]: {
      label: 'Português',
      lang: LOCALE_PT,
      description: descriptions.pt,
    },
  },
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
    ['script', {}, themeInitScript],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  ],
  themeConfig: {}
})
