import { Message } from 'element-ui'
import defaultSettings from '@/settings'
import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'
import themeColor from '../../../themeColor/index'

const theme = (themeColor, isInit) => {
  let flag = false
  let $message = null
  // 超过500ms还未切换成功则开启loading
  setTimeout(() => {
    if (!flag) {
      $message = Message({
        message: '请稍后',
        customClass: 'theme-message',
        type: 'success',
        duration: 0,
        iconClass: 'el-icon-loading'
      })
    }
  }, 500)
  const options = {
    newColors: forElementUI.getElementUISeries(themeColor)
  }
  let style = null
  if (isInit) {
    style = document.createElement('style')
    style.innerHTML = `#app{display: none;}`
    document.body.appendChild(style)
  }
  client.changer.changeColor(options, Promise).finally(() => {
    flag = true
    $message && $message.close()
    if (style) {
      document.body.removeChild(style)
    }
  })
}

const customSettingsStr = window.localStorage.getItem('CUSTOM_SETTINGS')
let customSettings = {}

if (customSettingsStr) {
  customSettings = JSON.parse(customSettingsStr)
  // 本地存在自定义的主题色则使用自定义的主题色
  if (customSettings.themeColor !== defaultSettings.customSettings) {
    theme(customSettings.themeColor, true)
  }
  // 项目自定义的默认主题色与实际代码中的主题色不同时切换为项目自定义的主题色
} else if (themeColor !== defaultSettings.themeColor) {
  theme(defaultSettings.themeColor, true)
}

const state = {
  ...defaultSettings,
  ...customSettings
}

const mutations = {
  CHANGE_SETTING: (state, data) => {
    for (const key in data) {
      if (data.hasOwnProperty(key) && state.hasOwnProperty(key)) {
        if (key === 'themeColor' && data.themeColor !== state.themeColor) {
          theme(data.themeColor)
        }
        state[key] = data[key]
      }
    }
    window.localStorage.setItem('CUSTOM_SETTINGS', JSON.stringify(state))
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

