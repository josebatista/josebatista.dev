import { createContentLoader } from 'vitepress'

import { LOCALE_PT, SECTIONS } from '../theme/constants'

const isPt = (url: string) => url.includes(`/${LOCALE_PT}/`)

export default createContentLoader([`${SECTIONS.PROJECTS}.md`, `${LOCALE_PT}/${SECTIONS.PROJECTS}.md`], {
  render: true,
  transform(raw) {
    const en = raw.find((p) => !isPt(p.url)) || raw[0]
    const pt = raw.find((p) => isPt(p.url))
    return [{
      projects: (en?.frontmatter as any)?.projects || [],
      projects_pt: (pt?.frontmatter as any)?.projects || [],
    }]
  },
})
