import { createContentLoader } from 'vitepress'

export default createContentLoader('about.md', {
  render: true,
})
