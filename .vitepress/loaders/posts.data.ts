import { createContentLoader } from 'vitepress'

import { PREFIX_EN, PREFIX_PT, SECTIONS } from '../theme/constants'

const isPt = (url: string) => url.includes(`/${PREFIX_PT}/`)
const slugOf = (url: string) => url.split('/').filter(Boolean).pop() || ''

export default createContentLoader(
  [`${PREFIX_EN}/${SECTIONS.POSTS}/**/*.md`, `${PREFIX_PT}/${SECTIONS.POSTS}/**/*.md`],
  {
    render: true,
    transform(rawData) {
      const ptHtml = new Map<string, string>()
      const ptFrontmatter = new Map<string, Record<string, any>>()
      const ptUrl = new Map<string, string>()

      const base = rawData
        .filter((page) => {
          if (isPt(page.url)) {
            const slug = slugOf(page.url)
            ptHtml.set(slug, page.html || '')
            ptFrontmatter.set(slug, page.frontmatter || {})
            ptUrl.set(slug, page.url)
            return false
          }
          return true
        })
        .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))

      return base.map((page) => {
        const slug = slugOf(page.url)
        const pt = ptFrontmatter.get(slug) || {}
        return {
          slug,
          url_en: page.url,
          url_pt: ptUrl.get(slug) || `/${PREFIX_PT}/${SECTIONS.POSTS}/${slug}`,
          title: page.frontmatter.title,
          title_pt: pt.title || '',
          date: new Date(page.frontmatter.date).toISOString(),
          tags: page.frontmatter.tags || [],
          description: page.frontmatter.description || '',
          description_pt: pt.description || '',
          cover: (page.frontmatter.cover as string) || '',
          cover_pt: (pt.cover as string) || '',
          html_en: page.html || '',
          html_pt: ptHtml.get(slug) || '',
        }
      })
    },
  },
)
