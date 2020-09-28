/**
 * @author Zhao Tian
 * @date 2020/6/12
 * @Description: 权限管理store
*/

import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 根据权限过滤路由
 * @param asyncRoutes
 * @param roles
 * @returns {*}
 */
export function filterAsyncRoutes(asyncRoutes, roles) {
  // 在这里处理权限路由相关逻辑

  return asyncRoutes
}

/**
 * 根据路由配置项生成菜单项
 * @param routes
 */
export function getMenusByRoutes(routes) {
  const menus = []
  const getMenu = (route, basePath = '') => {
    let menu = null
    // 兼容vue-router的 path: 'foo' 和 path: '/foo'两种配置路由的方式
    let routePath = route.path
    if (routePath.indexOf('/') !== 0) {
      routePath = basePath + route.path
    }
    if (!route.hidden) { // 隐藏的路由不生成菜单
      if (!route.meta) { // 未设置meta的路由时，如果子级设置了唯一的菜单路由，则使用子级的菜单路由
        if (route.children) {
          const filter = route.children.filter(item => !item.hidden)
          if (filter.length === 1) {
            menu = getMenu(filter[0], routePath + '/')
          }
        }
      } else {
        menu = {
          title: route.meta.title,
          icon: route.meta.icon,
          routePath,
          routeName: route.name
        }
        if (route.children) {
          const children = []
          route.children.forEach(child => {
            const childMenu = getMenu(child, routePath + '/')
            if (childMenu) {
              children.push(childMenu)
            }
          })
          if (children.length > 0) {
            menu.children = children
            // 当前路由未设置重定向时，若存在子菜单的情况下，父菜单的重定向地址就是第一个子菜单的地址
            if (!route.redirect) {
              route.redirect = children[0].routePath
            }
          }
        }
      }
    }
    return menu
  }
  routes.forEach(route => {
    const menu = getMenu(route)
    if (menu) {
      menus.push(menu)
    }
  })
  return menus
}

const state = {
  routes: [],
  menus: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  async generateRoutes({ commit, dispatch/*, rootGetters */ }) {
    // const userInfo = rootGetters.userInfo
    // const res = await queryUserMenu({ userCode: userInfo.userCode })
    // const roles = res.data
    const roles = []
    const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    if (accessedRoutes.length === 0) { // 没有任何菜单的权限
      return Promise.reject({ errCode: 403 })
    }
    const menus = getMenusByRoutes(constantRoutes.concat(accessedRoutes))
    const homeRoute = { path: '/', redirect: menus[0] ? menus[0].routePath : '/404' }
    accessedRoutes.unshift(homeRoute) // 添加首页
    accessedRoutes.push({ path: '*', redirect: '/404' }) // 添加404页
    const routes = constantRoutes.concat(accessedRoutes)
    commit('SET_MENUS', menus)
    commit('SET_ROUTES', routes)
    dispatch('tagsView/setAffixTags', routes, { root: true })
    return Promise.resolve(accessedRoutes)
  },
  resetRoute({ commit }) {
    commit('SET_ROUTES', [])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
