import DefaultTheme from 'vitepress/theme'
import DesktopHome from './layouts/DesktopHome.vue'
import PostLayout from './layouts/PostLayout.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DesktopHome', DesktopHome)
    app.component('PostLayout', PostLayout)
  }
}
