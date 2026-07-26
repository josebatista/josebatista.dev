# josebatista.dev — Agent Guide

## Stack
- **VitePress** (v1.6.4) as SSG — compiles markdown to static HTML
- **Vue 3** (Composition API, `<script setup>`) for interactive components
- **pnpm** (v10+) as package manager
- All CSS is hand-written in `.vitepress/theme/style.css` (no framework)

## Commands
```sh
pnpm dev       # dev server at http://localhost:5173
pnpm build     # static output to .vitepress/dist
pnpm preview   # preview the built output
```

## Architecture

### Content vs Layout
All content lives in markdown files under `src/`. Vue components handle only layout and behavior. Never hardcode content in Vue files.

| Markdown file | Contents | Loaded by |
|---|---|---|
| `src/index.md` | Home page entrypoint (`layout: false`, renders `<DesktopHome />`) | — |
| `src/about.md` | Bio text | `about.data.ts` → `AboutWindow.vue` |
| `src/projects.md` | Frontmatter `projects[]` (name, description, language, stars) | `projects.data.ts` → `ProjectsWindow.vue` |
| `src/contact.md` | Frontmatter `links[]` (label, url, text) | `contact.data.ts` → `ContactWindow.vue` |
| `src/posts/*.md` | Blog articles with frontmatter (title, date, tags[], description) | `posts.data.ts` → `BlogWindow.vue` |

### Data loaders
Located in `.vitepress/theme/*.data.ts`. Each uses `createContentLoader` with `render: true`. Glob patterns are relative to `srcDir` (`src/`). Imports use `.js` extension in Vue files (VitePress convention).

### Component tree
```
index.md (layout: false)
  DesktopHome.vue         — wallpaper, top bar, desktop icons, window manager
    TopBar.vue            — fixed top bar (brand + clock, extracted component)
    DesktopIcon.vue       — single desktop shortcut icon
    Window.vue            — draggable window frame (title bar, controls, content slot)
      windows/*.vue       — AboutWindow, BlogWindow, ProjectsWindow, ContactWindow
        Terminal.vue      — reusable terminal frame (prompt, body slot, cursor, statusbar)
        GridItem.vue      — reusable grid card (thumbnail + body slots, default 📄)
        ListItem.vue      — reusable sidebar row (icon + title + desc + meta slot)
```

### Window system
- Windows are draggable by title bar, max 1 at a time being dragged
- `Window.vue` emits `close`, `focus`, `toggle-maximize` to `DesktopHome.vue`
- `DesktopHome.vue` manages window stack (z-index, open/close, maximize/restore)
- Opening animation: class `window-opening` (scale 0.95, opacity 0) removed on first animation frame
- Closing animation: class `window-closing` added → 200ms timeout → emit `close`
- Maximized windows sit below the fixed top bar (36px offset)

### Key conventions
- All imports of `.data.ts` files in Vue use `.js` extension (e.g., `from '../posts.data.js'`)
- `createContentLoader` globs are relative to `srcDir: 'src'`
- CSS class `.window-statusbar` is shared across all window content components
- `Terminal.vue` — wraps content in a terminal frame (prompt line + body slot + blinking cursor + optional statusbar slot)
- `GridItem.vue` — reusable grid card with named slots `thumbnail` and default `body` (defaults to 📄 icon + title + date)
- `ListItem.vue` — reusable sidebar row with props `title`, `description`, `active` and a `#meta` slot for tags/date
- Desktop icons defined in `DesktopHome.vue` — 4 icons: about_me.sh (terminal), Blog (folder), Projects.lnk (folder_open), Contact.sh (mail) — 4 icons: about_me.sh (terminal), Blog (folder), Projects.lnk (folder_open), Contact.sh (mail)

### Design tokens (CSS variables)
Colors, spacing, typography in `:root` inside `style.css`. Dark theme only (`appearance: false` in config). Primary green (`#00ff41`), secondary blue (`#3584e4`).

### Build output
Static files in `.vitepress/dist/`. Each markdown page generates its own HTML (e.g., `/posts/build-linux-kernel.html`).
