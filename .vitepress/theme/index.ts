import DefaultTheme from 'vitepress/theme'
import DesktopHome from './layouts/DesktopHome.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DesktopHome', DesktopHome)
  }
}
