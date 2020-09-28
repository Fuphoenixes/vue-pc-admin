import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { isExternal } from '@/utils/validate'
import { obj2Params } from './index.js'

// axios 文档 https://www.kancloud.cn/yunye/axios/234845

const CancelToken = axios.CancelToken
let reLoginFlag = false

const request = ({
  mock = false, // 是否使用mock接口
  url, // 接口地址
  method, // 请求方式
  data, // 请求参数
  headers = {}, // 请求头
  timeout = 10000, // 默认超时时间10秒
  requestType = 'json', // 请求类型  json,form,multiply
  noMessage = 0, // 自动提示错误 0.都提示 1.请求失败时提示，请求成功数据不正常时（eg: res.code !== 'ok'）不提示 2.都不提示
  cancelExecutor = () => {}, // 取消请求的executor,详见axios文档
  needResponse = false, // 1.true 返回整个 response 2.false 只返回response.data
  ...others
}) => {
  return new Promise((resolve, reject) => {
    if (!isExternal(url)) {
      if (mock) {
        url = '/mock' + url
      } else {
        url = process.env.VUE_APP_BASE_API + url
      }
    }
    const config = {
      url,
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': requestType === 'json' ? 'application/json; charset=utf-8' : 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        ...headers
      },
      timeout,
      // eslint-disable-next-line no-mixed-spaces-and-tabs
      cancelToken: new CancelToken(function executor(c) {
        cancelExecutor(c)
      }),
      ...others
    }
    switch (method.toUpperCase()) {
      case 'GET':
        config.params = data
        break
      case 'POST':
        switch (requestType) {
          case 'json':
            config.data = data
            break
          case 'form':
            config.data = obj2Params(data)
            break
          case 'multiply':
            // eslint-disable-next-line no-case-declarations
            const formData = new FormData()
            Object.keys(data).forEach(key => {
              formData.append(key, data[key])
            })
            config.data = formData
            break
        }
        break
    }

    axios(config).then(response => {
      const res = response.data
      if (needResponse) {
        resolve(response)
        return
      }
      if (res.status !== 200) {
        if (res.status === 401 || (res.status === 610 && res.message.includes('cloud-ident'))) {
          // 防止重复执行
          if (!reLoginFlag) {
            reLoginFlag = true
            // to re-login
            MessageBox.confirm('登录过期，请重新登录', '提示', {
              type: 'warning',
              customClass: 'messageBox401'
            }).then(() => {
              store.dispatch('user/logout')
            }).finally(() => {
              reLoginFlag = false
            })
          }
          reject({ errorCode: 401 })
          return
        } else if (noMessage === 0) {
          Message({
            message: res.message || 'Error',
            type: 'error',
            duration: 5 * 1000,
            showClose: true
          })
        }
        reject(new Error(res.message || 'Error'))
      } else {
        resolve(res)
      }
    }).catch(error => {
      console.log('err' + error) // for debug
      if (noMessage === 0 || noMessage === 1) {
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000,
          showClose: true
        })
      }
      reject(error)
    })
  })
}

export default request
