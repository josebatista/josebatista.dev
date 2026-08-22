import { createContentLoader } from 'vitepress'

import { LOCALE_PT, SECTIONS } from '../theme/constants'

const isPt = (url: string) => url.includes(`/${LOCALE_PT}/`)

export default createContentLoader([`${SECTIONS.ABOUT}.md`, `${LOCALE_PT}/${SECTIONS.ABOUT}.md`], {
  render: true,
  transform(raw) {
    const en = raw.find((p) => !isPt(p.url)) || raw[0]
    const pt = raw.find((p) => isPt(p.url))
    return [{
      html_en: en?.html || '',
      html_pt: pt?.html || '',
    }]
  },
})
