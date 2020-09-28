import { login, getInfo } from '@/api/user'
import router, { resetRouter } from '@/router'

const state = {
  userInfo: null
}

const mutations = {
  RESET_STATE: (state) => {
    state.userInfo = null
    // localStorage.removeItem('APP_USER_INFO')
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(res => {
        // commit('SET_USER_INFO', res.data)
        // localStorage.setItem('APP_USER_INFO', JSON.stringify(res.data))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('验证失败请重新登录')
        }

        commit('SET_USER_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      resetRouter()
      commit('RESET_STATE')
      if (process.env.VUE_APP_USE_LOGIN === 'true') {
        router.push(`/login?redirect=${router.app.$route.fullPath}`)
      } else {
        /*
        * 请填写单点登录页面的地址
        * eg:
        *  import { stringify } from 'qs';
        *  const redirect = stringify({
        *    service: window.location.href,
        *  });
        *  const loginPath = 'http://xxxxxx?' + redirect
        *  window.location.replace(loginPath)
        * */
        const loginPath = ''
        if (!loginPath) {
          console.error('开发者请填写单点登录页面的地址')
        }
        // window.location.replace('')
      }

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

