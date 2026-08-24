import { createContentLoader } from 'vitepress'

import { LOCALE_PT, SECTIONS } from '../theme/constants'

const isPt = (url: string) => url.includes(`/${LOCALE_PT}/`)
const slugOf = (url: string) => url.split('/').filter(Boolean).pop() || ''

export default createContentLoader([`${SECTIONS.POSTS}/**/*.md`, `${LOCALE_PT}/${SECTIONS.POSTS}/**/*.md`], {
  render: true,
  transform(rawData) {
    const ptHtml = new Map<string, string>()
    const ptFrontmatter = new Map<string, Record<string, any>>()

    const base = rawData
      .filter((page) => {
        if (isPt(page.url)) {
          const slug = slugOf(page.url)
          ptHtml.set(slug, page.html || '')
          ptFrontmatter.set(slug, page.frontmatter || {})
          return false
        }
        return true
      })
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))

    return base.map((page) => {
      const slug = slugOf(page.url)
      const pt = ptFrontmatter.get(slug) || {}
      return {
        url: page.url,
        title: page.frontmatter.title,
        title_pt: pt.title || '',
        date: new Date(page.frontmatter.date).toISOString(),
        tags: page.frontmatter.tags || [],
        description: page.frontmatter.description || '',
        description_pt: pt.description || '',
        cover: (page.frontmatter.cover as string) || '',
        html_en: page.html || '',
        html_pt: ptHtml.get(slug) || '',
      }
    })
  },
})
