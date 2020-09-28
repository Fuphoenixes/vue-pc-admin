import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * hidden: true                  当设置 true 的时候该路由不会在菜单中出现 如401，login等页面，或者如一些编辑页面/edit/1  (默认 false)
 * name:'router-name'            设定路由的名字，一定要填写不然使用<keep-alive>时会出现页面操作无法记录的问题
 *                               如果name是 foo.xxx 那么该路由将会作为 name 是 foo 的路由的下一级页面，并自动提供提供前进加载后退缓存功能
 * meta : {
    title: 'title'               设置该路由在菜单和面包屑中展示的名字
    icon: 'svg-name'             设置该路由的菜单图标
    affix: true                  如果设置为true该路由对应的标签将一直显示在标签页中
    breadcrumb: false            如果设置为false该路由将不会显示在面包屑中（默认true）
    activeMenu: '/foo'           如果设置对应路由地址,访问本路由时菜单栏会高亮你设置路由对应的菜单
    activeTag: '/foo'			       如果设置对应路由地址,访问本路由时标签页会高亮你设置路由对应的标签
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  }

]

if (process.env.VUE_APP_USE_LOGIN !== 'false') {
  constantRoutes.push({
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  })
}

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404' }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
