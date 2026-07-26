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
      date: new Date(page.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tags: page.frontmatter.tags || [],
      description: page.frontmatter.description || '',
      html: page.html,
      excerpt: page.excerpt
    }))
  }
})
