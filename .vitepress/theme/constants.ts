export const SITE_NAME = 'josebatista.dev'

export const LOCALE_EN = 'en-US'
export const LOCALE_PT = 'pt-BR'

export const PREFIX_EN = 'en'
export const PREFIX_PT = 'pt'

export const WINDOW_TYPES = {
  TERMINAL: 'terminal',
  BLOG: 'blog',
  PROJECTS: 'projects',
  CONTACT: 'contact',
  NOT_FOUND: 'not-found',
} as const

export type WindowType = (typeof WINDOW_TYPES)[keyof typeof WINDOW_TYPES]

export const SECTIONS = {
  ABOUT: 'about',
  BLOG: 'blog',
  PROJECTS: 'projects',
  CONTACT: 'contact',
  POSTS: 'posts',
  NOT_FOUND: 'not-found',
} as const

export const SYSINFO = {
  user: 'josebatista',
  permissions: 'rwxr-xr-x',
  diskUsed: '2.4 MB',
  diskTotal: '3.0 MB',
  diskPercent: 82,
  terminal: 'zsh | utf-8 | josebatista@os-v1.0',
  sync: 'SYNC: OK | v1.0.4-STABLE',
}

export const GISCUS = {
  repo: 'josebatista/josebatista.dev',
  repoId: 'R_kgDOUAg-1Q',
  category: 'Announcements',
  categoryId: 'DIC_kwDOUAg-1c4DEGRi',
} as const
