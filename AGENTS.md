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
| `src/about.md` | Bio text | `loaders/about.data.ts` → `AboutWindow.vue` |
| `src/projects.md` | Frontmatter `projects[]` (name, description, language, stars) | `loaders/projects.data.ts` → `ProjectsWindow.vue` |
| `src/contact.md` | Frontmatter `links[]` (label, url, text) | `loaders/contact.data.ts` → `ContactWindow.vue` |
| `src/posts/*.md` | Blog articles with frontmatter (title, date, tags[], description) | `loaders/posts.data.ts` → `BlogWindow.vue` |

### Data loaders
Located in `.vitepress/loaders/*.data.ts`. Each uses `createContentLoader` with `render: true`. Glob patterns are relative to `srcDir` (`src/`). Imports use `.js` extension in Vue files (VitePress convention).

### Component tree
```
index.md (layout: false)
  layouts/DesktopHome.vue       — wallpaper, top bar, desktop icons, window manager
    components/TopBar.vue       — fixed top bar (brand + clock)
    components/MatrixRain.vue   — decorative canvas "Matrix digital rain" wallpaper (behind everything)
    components/DesktopIcon.vue  — single desktop shortcut icon
    components/Window.vue       — draggable window frame (title bar, controls, content slot)
      content/*.vue             — AboutWindow, BlogWindow, ProjectsWindow, ContactWindow
        components/Terminal.vue — reusable terminal frame (prompt, body slot, cursor, statusbar)
        components/GridItem.vue — reusable grid card (thumbnail + body slots, default `description` icon)
        components/ListItem.vue — reusable sidebar row (icon + title + desc + meta slot)
```

### Wallpaper / Matrix rain
- `components/MatrixRain.vue` renders a `<canvas>` inside `.desktop-wallpaper` (z-index 0), so it sits behind the desktop icons **and** any open window — opening a window covers the animation.
- All tunables live in a single `config` object at the top of the component (font size, `fps`, `fadeAlpha`, `glyphAlpha`, `headAlpha`, `headChance`, `resetChance`, `cssOpacity`, `maxDpr`). Adjust there — do not hardcode in the draw loop.
- Performance: `requestAnimationFrame` throttled to ~22fps, `devicePixelRatio` capped at `maxDpr`, transparent canvas with `destination-out` trailing fade (no per-frame full redraw), pauses on `visibilitychange`, and respects `prefers-reduced-motion` (draws one static frame instead of animating).
- `pointer-events: none` so it never blocks desktop interaction.
- `cssOpacity` (~`0.6`) controls overall subtlety; raise `glyphAlpha` for more visible trails.

### Window system
- Windows are draggable by title bar, max 1 at a time being dragged
- `Window.vue` emits `close`, `focus`, `toggle-maximize` to `DesktopHome.vue`
- `DesktopHome.vue` manages window stack (z-index, open/close, maximize/restore)
- Opening animation: class `window-opening` (scale 0.95, opacity 0) removed on first animation frame
- Closing animation: class `window-closing` added → 200ms timeout → emit `close`
- Maximized windows sit below the fixed top bar (36px offset)
- Double-click titlebar toggles maximize; `Escape` closes the focused window; bottom-right corner grip resizes (min 320×240)

### Accessibility conventions
- All interactive elements are real `<button>`/`<a>`/`<input>` — never divs with `@click`/`@dblclick`
- Widgets converted to buttons use the zero-specificity `:where(.ui-button)` reset class so component styles still win
- Desktop icons open on single click (no double-click needed); `Enter`/`Space` work natively
- Focus is managed: new windows focus themselves on mount; `DesktopHome` returns focus to the opener icon on close; blog view swaps focus the grid/article panel via `tabindex="-1"` + `nextTick`
- Windows are `role="dialog"` with `aria-labelledby` (Vue `useId()`) on the title
- `:focus-visible` outline = 2px solid `var(--primary)` (`.window:focus` exempted)
- Landmarks: `.desktop` is `<main>`, `.top-bar` is `<header>`; `target="_blank"` links get `rel="noopener noreferrer"` + "opens in new tab" aria-label
- `DesktopHome` renders a `.sr-only` `<h1>` (default "josebatista.dev"; `PostLayout` passes the post title via the `title` prop) so heading hierarchy starts at level 1
- `BlogWindow` updates `document.title` on open/back (`{post title} | josebatista.dev`); item count is `aria-live="polite"`; active sidebar row uses `aria-current="true"`
- Don't add `id="VPContent"` yourself — VitePress owns that id on post pages (skip link targets it)
- `@media (prefers-reduced-motion: reduce)` collapses all transitions/animations and pins the cursor

### Blog deep linking
- Every blog post uses a custom `PostLayout` (`.vitepress/theme/layouts/PostLayout.vue`) that renders `DesktopHome` and derives its slug from `useData().page.relativePath`
- `DesktopHome.vue` accepts an `initialArticle` prop; `onMounted` opens the Blog window with `{ initialArticle }` passed via `Window.vue` → `BlogWindow.vue`
- `BlogWindow.vue` reads `initialArticle`, finds the post by URL suffix, and opens the split view (post + terminal) instead of the grid
- Switching articles (grid → article, or sidebar → different article) resets the article scroll container to top: `openPost()` sets `articleRef.value.scrollTop = 0` after `nextTick`. The `blog-article` element is the scroller (`overflow-y: auto`) and is reused across posts, so without this reset the scroll position carries over.
- URL syncing: `openPost()` writes `history.replaceState` to the post URL (`/posts/<slug>`); `backToGrid()` resets to `/`. Posts use clean URLs (`cleanUrls: true`)
- Post frontmatter (`src/posts/*.md`) must include `layout: PostLayout` for deep linking to work

### Key conventions
- All imports of `.data.ts` files in Vue use `.js` extension (e.g., `from '../../loaders/posts.data.js'`)
- `createContentLoader` globs are relative to `srcDir: 'src'`
- CSS class `.window-statusbar` is shared across all window content components
- `Terminal.vue` — wraps content in a terminal frame (prompt line + body slot + blinking cursor + optional statusbar slot)
- `GridItem.vue` — reusable grid card with named slots `thumbnail` and default `body` (defaults to `description` Material Symbol icon + title + date)
- `ListItem.vue` — reusable sidebar row with props `title`, `description`, `active` and a `#meta` slot for tags/date
- Desktop icons defined in `DesktopHome.vue` — 4 icons: about_me.sh (terminal), Blog (folder), Projects.lnk (folder_open), Contact.sh (mail)

### Icon system (Material Symbols Outlined)
- All UI icons use **Material Symbols Outlined** (ligature font), not emoji or text glyphs.
- Loaded via a Google Fonts `<link>` in `config.ts` `head: [['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined...' }]]`.
- Render an icon by putting the symbol name as the element text with class `material-symbols-outlined`, e.g. `<span class="material-symbols-outlined">folder_open</span>`. Base styling (font-family, sizing) lives in `.material-symbols-outlined` in `style.css`.
- Icon names are literal strings passed through the data (e.g. `icon.icon` on desktop icons, `icon` prop on `GridItem`/`ListItem`, default `description`). Do not use emoji (📄, 📁, etc.) — they were removed.
- Common symbols: `terminal`, `folder`, `folder_open`, `mail`, `description`, `search`, `arrow_back`, `home`.
- **Offline caveat:** the font is loaded from Google's CDN at runtime; with no network the `<span>` shows the literal symbol name as text. To make it self-contained, self-host the woff2 and add an `@font-face`.

### Design tokens (CSS variables)
Colors, spacing, typography in `:root` inside `style.css`. Dark theme only (`appearance: false` in config). Primary green (`#00ff41`), secondary blue (`#3584e4`).

### VitePress config notes (`.vitepress/config.ts`)
- `appearance: false` — dark-only, **no `.dark` class** is applied to `<html>`, so the custom `:root` tokens (not VitePress's `.dark` vars) drive the theme.
- `markdown.theme: 'github-dark'` — **required** for correct code highlighting. The site is dark-only and never gets a `.dark` class, so leaving Shiki on its dual `github-light github-dark` default would render code with the unreadable light palette. Keep `markdown.theme` pinned to a single dark theme.
- `cleanUrls: true` — blog posts resolve at `/posts/<slug>` (no `.html` suffix).
- `head` includes the Material Symbols Outlined font `<link>` (see Icon system above).

### Build output
Static files in `.vitepress/dist/`. Each markdown page generates its own HTML (e.g., `/posts/build-linux-kernel.html`).
