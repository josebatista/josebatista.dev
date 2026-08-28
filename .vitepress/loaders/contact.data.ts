import { createContentLoader } from 'vitepress'

import { PREFIX_EN, PREFIX_PT, SECTIONS } from '../theme/constants'

const isPt = (url: string) => url.includes(`/${PREFIX_PT}/`)

export default createContentLoader([`${PREFIX_EN}/${SECTIONS.CONTACT}.md`, `${PREFIX_PT}/${SECTIONS.CONTACT}.md`], {
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
