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
    role: 'admin'			           设置该路由的权限，未设置则代表所有角色均可访问
  }
 */

/**
 * 如果当前路由未配置component属性，且存在children属性，
 * 则将children放到到其父级的children中
 * 用于多级路由配置
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
  {
    path: '/guide',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'guide',
        component: () => import('@/views/guide/index'),
        meta: { title: '引导页', icon: 'guide' }
      }
    ]
  },
  {
    path: '/table',
    component: Layout,
    redirect: '/table/pagination',
    name: 'table',
    meta: { title: '表格', icon: 'table' },
    children: [
      {
        path: 'pagination',
        name: 'table-pagination',
        component: () => import('@/views/table/pagination'),
        meta: { title: '分页表格' }
      },
      {
        path: 'infinite',
        name: 'table-infinite',
        component: () => import('@/views/table/infinite'),
        meta: { title: '滚动表格' }
      },
      {
        path: 'complex',
        name: 'table-complex',
        component: () => import('@/views/table/complex'),
        meta: { title: '综合表格' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'excel',
    meta: { title: 'Excel', icon: 'excel' },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'export-excel',
        meta: { title: '自定义导出' }
      },
      {
        path: 'selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'selected-excel',
        meta: { title: '导出已选项' }
      },
      {
        path: 'merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'merge-header',
        meta: { title: '导出多级表头' }
      },
      {
        path: 'export-table',
        component: () => import('@/views/excel/export-table'),
        name: 'export-table',
        meta: { title: '根据table导出' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'upload-excel',
        meta: { title: '上传 Excel' }
      }
    ]
  },
  {
    path: '/charts',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'charts',
        component: () => import('@/views/charts/index'),
        meta: { title: '图表', icon: 'chart' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'form',
        component: () => import('@/views/form/index'),
        meta: { title: '表单', icon: 'form' }
      }
    ]
  },
  {
    path: '/components',
    component: Layout,
    redirect: '/components/editor',
    meta: { title: '组件', icon: 'components' },
    children: [
      {
        path: 'editor',
        name: 'components-editor',
        component: () => import('@/views/components/editor/index'),
        meta: { title: '富文本', icon: 'editor' }
      },
      {
        path: 'markdown',
        name: 'components-markdown',
        component: () => import('@/views/components/markdown/index'),
        meta: { title: 'markdown', icon: 'markdown' }
      },
      {
        path: 'inputGroup',
        name: 'components-inputGroup',
        component: () => import('@/views/components/inputGroup/index'),
        meta: { title: 'inputGroup', icon: 'inputGroup' }
      },
      {
        path: 'tree',
        name: 'components-tree',
        component: () => import('@/views/components/tree/index'),
        meta: { title: '树型', icon: 'tree' }
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
