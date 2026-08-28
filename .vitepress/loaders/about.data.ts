import { createContentLoader } from 'vitepress'

import { PREFIX_EN, PREFIX_PT, SECTIONS } from '../theme/constants'

const isPt = (url: string) => url.includes(`/${PREFIX_PT}/`)

export default createContentLoader([`${PREFIX_EN}/${SECTIONS.ABOUT}.md`, `${PREFIX_PT}/${SECTIONS.ABOUT}.md`], {
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
