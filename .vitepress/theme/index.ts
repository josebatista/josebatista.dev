import DefaultTheme from 'vitepress/theme'
import DesktopHome from './DesktopHome.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DesktopHome', DesktopHome)
  }
}
