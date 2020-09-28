import Vue from 'vue'

const getRouteByPath = (path, routes) => {
  let route
  const fn = (arr, basePath = '') => {
    for (const item of arr) {
      let routePath = item.path
      if (routePath.indexOf('/') !== 0) {
        routePath = basePath + item.path
      }
      if (routePath === path) {
        route = item
        break
      } else if (item.children) {
        fn(item.children, routePath + '/')
      }
    }
  }
  fn(routes)
  return route
}

const createTag = (view, rootState) => {
  if (!view.name || !view.meta) return
  if (view.meta.activeTag) {
    const routes = rootState.permission.routes
    const route = getRouteByPath(view.meta.activeTag, routes)
    if (route && route.meta && route.name) {
      return {
        title: route.meta.title || 'no-name', // 标题
        routeName: route.name,
        routePath: view.path
      }
    }
  }
  return {
    title: view.meta.title || 'no-name', // 标题
    routeName: view.name,
    routePath: view.fullPath
  }
}

const state = {
  affixTags: [],
  visitedTags: [],
  cachedViews: []
}

const mutations = {
  ADD_VISITED_TAG: (state, tag) => {
    state.visitedTags.push(tag)
  },
  UPDATE_VISITED_TAG: (state, tag) => {
    const index = state.visitedTags.findIndex(t => t.routeName === tag.routeName)
    // state.visitedTags[index] = tag;
    Vue.set(state.visitedTags, index, tag)
  },
  DEL_VISITED_TAG: (state, tag) => {
    const index = state.visitedTags.findIndex(t => t.routeName === tag.routeName)
    state.visitedTags.splice(index, 1)
  },
  DEL_ALL_VISITED_TAGS: (state) => {
    const affixTags = state.affixTags
    const newVisitedTags = state.visitedTags.filter(t => {
      return affixTags.some(item => item.routeName === t.routeName)
    })
    state.visitedTags = newVisitedTags
  },
  DEL_OTHERS_VISITED_TAGS: (state, tag) => {
    const affixTags = state.affixTags
    const newVisitedTags = state.visitedTags.filter(t => {
      return affixTags.some(item => item.routeName === t.routeName) || tag.routeName === t.routeName
    })
    state.visitedTags = newVisitedTags
  },

  ADD_CACHED_VIEW: (state, name) => {
    if (state.cachedViews.includes(name)) return
    state.cachedViews.push(name)
  },
  DEL_CACHED_VIEW: (state, name) => {
    const newCachedViews = []
    const getReg = str => new RegExp('^' + str + '(.[\\w\\W]+)?$') // 匹配 str 和 str-xxx
    state.cachedViews.forEach(item => {
      if (!getReg(name).test(item)) {
        newCachedViews.push(item)
      }
    })
    state.cachedViews = newCachedViews
  },
  DEL_ALL_CACHED_VIEWS: (state) => {
    const affixTags = state.affixTags
    const getReg = str => new RegExp('^' + str + '(.[\\w\\W]+)?$')
    const newCachedViews = state.cachedViews.filter(item => {
      return affixTags.some(t => getReg(t.routeName).test(item))
    })
    state.cachedViews = newCachedViews
  },
  DEL_OTHERS_CACHED_VIEWS: (state, name) => {
    const affixTags = state.affixTags
    const getReg = str => new RegExp('^' + str + '(.[\\w\\W]+)?$')
    const newCachedViews = state.cachedViews.filter(item => {
      return getReg(name).test(item) || affixTags.some(t => getReg(t.routeName).test(item))
    })
    state.cachedViews = newCachedViews
  },
  NO_TAGS_ADD_VIEW: (state, name) => {
    if (!state.cachedViews.includes(name)) {
      state.cachedViews.push(name)
    }
    const getReg = str => new RegExp('^' + str + '(.[\\w\\W]+)?$')
    const newCachedViews = state.cachedViews.filter(item => getReg(item).test(name))
    state.cachedViews = newCachedViews
  },
  SET_AFFIX_TAGS: (state, affixTags) => {
    state.affixTags = affixTags
    state.visitedTags = [...affixTags]
    state.cachedViews = []
  }
}

const actions = {
  addView({ commit, state, rootState }, view) {
    const { visitedTags } = state
    const tag = createTag(view, rootState)
    // console.log(view,'view')
    // console.log(tag,'tag')
    if (!tag) return
    if (visitedTags.some(t => tag.routeName === t.routeName)) {
      commit('UPDATE_VISITED_TAG', tag)
      commit('DEL_CACHED_VIEW', view.name)
    } else {
      commit('ADD_VISITED_TAG', tag)
    }
    commit('ADD_CACHED_VIEW', view.name)
  },
  delTag({ commit, state }, tag) {
    return new Promise(resolve => {
      commit('DEL_VISITED_TAG', tag)
      commit('DEL_CACHED_VIEW', tag.routeName)
      resolve({
        visitedTags: [...state.visitedTags],
        cachedViews: [...state.cachedViews]
      })
    })
  },

  delOthersTags({ commit }, tag) {
    commit('DEL_OTHERS_VISITED_TAGS', tag)
    commit('DEL_OTHERS_CACHED_VIEWS', tag.routeName)
  },

  delAllTags({ commit }) {
    commit('DEL_ALL_VISITED_TAGS')
    commit('DEL_ALL_CACHED_VIEWS')
  },
  noTagsAddView({ commit }, view) {
    commit('NO_TAGS_ADD_VIEW', view.name)
  },
  setAffixTags({ commit }, routes) {
    const affixTags = []
    const fn = (arr, basePath = '') => {
      arr.forEach(route => {
        if (route.meta && route.meta.affix && !route.hidden) {
          affixTags.push({
            title: route.meta.title,
            routeName: route.name,
            routePath: basePath + route.path
          })
        }
        if (route.children) {
          fn(route.children, basePath + route.path + '/')
        }
      })
    }
    fn(routes)
    commit('SET_AFFIX_TAGS', affixTags)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
