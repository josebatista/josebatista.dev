import { createContentLoader } from 'vitepress'

import { LOCALE_PT, SECTIONS } from '../theme/constants'

const isPt = (url: string) => url.includes(`/${LOCALE_PT}/`)

export default createContentLoader([`${SECTIONS.CONTACT}.md`, `${LOCALE_PT}/${SECTIONS.CONTACT}.md`], {
  render: true,
  transform(raw) {
    const en = raw.find((p) => !isPt(p.url)) || raw[0]
    const pt = raw.find((p) => isPt(p.url))
    return [{
      links: (en?.frontmatter as any)?.links || [],
      links_pt: (pt?.frontmatter as any)?.links || [],
    }]
  },
})
