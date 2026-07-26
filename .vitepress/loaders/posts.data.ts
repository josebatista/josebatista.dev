import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  render: true,
  excerpt: true,
  transform(rawData) {
    return rawData.sort((a, b) => {
      return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
    }).map(page => ({
      url: page.url,
      title: page.frontmatter.title,
      date: page.frontmatter.date,
      tags: page.frontmatter.tags || [],
      description: page.frontmatter.description || '',
      html: page.html,
      excerpt: page.excerpt
    }))
  }
})
