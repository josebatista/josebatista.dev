import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import DesktopHome from './layouts/DesktopHome.vue'
import PostLayout from './layouts/PostLayout.vue'
import { initTheme } from './theme/index'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('DesktopHome', DesktopHome)
    app.component('PostLayout', PostLayout)
    initTheme()
  }
}
