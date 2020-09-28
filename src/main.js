import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/utils/elementuiFix' // 覆盖一些element-ui的设定和修复一些bug
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import { addClass } from '@/utils/className'

import '@/icons' // icon
import '@/permission' // permission control

import loadingPlugin from 'v-loading-plugin'
import ElMenu from '@/components/ElMenu/index.js'
import LbTable from '@/components/LbTable'
import ElTableForm from '@/components/ELTableForm'
import ElInputGroup from '@/components/ElInputGroup'
import FuPage from '@/components/FuPage'

import adaptive from '@/directive/el-height-adaptive-table/index.js'
import elTableInfiniteScroll from '@/directive/el-table-infinite-scroll/index.js'
import drag from '@/directive/el-drag-dialog'
import getCachedPageByName from '@/utils/getCachedPageByName'

Vue.use(loadingPlugin)
Vue.use(LbTable)
Vue.use(ElTableForm)
Vue.use(ElInputGroup)
Vue.use(FuPage)
Vue.use(adaptive)
Vue.use(elTableInfiniteScroll)
Vue.use(drag)
Vue.prototype.$getCachedPageByName = getCachedPageByName

if (process.env.VUE_APP_USE_MOCKXHR === 'true') {
  const mockXHR = require('./utils/mockXHR').default
  mockXHR()
}

Vue.use(ElementUI, {
  size: store.state.settings.size // set element-ui default size
})
window.addEventListener('load', () => {
  addClass(document.body, `PAGE-SIZE-${store.state.settings.size}`)
})

// element-ui 2.13.0版本菜单组件有bug,这里改手动引用2.10.0版本以及部分bug处理
Vue.use(ElMenu)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
