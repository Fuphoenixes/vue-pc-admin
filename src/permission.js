import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    const hasGetUserInfo = store.getters.userInfo
    if (hasGetUserInfo) {
      next()
    } else {
      try {
        // get user info
        await store.dispatch('user/getInfo')
        // generate accessible routes map based on roles
        const accessRoutes = await store.dispatch('permission/generateRoutes')

        // dynamically add accessible routes
        router.addRoutes(accessRoutes)
        if (from.path === '/login' && router.match(to).path === '/404') {
          next({ path: '/', replace: true })
        } else {
          next({ ...to, replace: true })
        }
      } catch (error) {
        if (error.errorCode === 401 && process.env.NODE_ENV === 'production') {
          // if (error.errorCode === 401) {
          // 关闭弹窗
          document.querySelector('.messageBox401 .el-button').click()
          await store.dispatch('user/logout', true)
        }
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
