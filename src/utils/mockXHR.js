import Mock from 'mockjs'
import { param2Obj } from './index'

const mocks = require('../../mock').mocks
// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(response) {
    return function(options) {
      let result = null
      if (response instanceof Function) {
        const { body, type, url } = options
        // 兼容 webpack-api-mocker 的配置
        response(
          {
            method: type,
            body: JSON.parse(body),
            query: param2Obj(url)
          },
          {
            send: (res) => {
              result = res
            }
          })
      } else {
        result = response
      }
      return Mock.mock(result)
    }
  }

  for (const i in mocks) {
    const url = i.split(' ')[1]
    const type = i.split(' ')[0].toLowerCase()
    const response = mocks[i]
    Mock.mock(new RegExp(url), type || 'get', XHR2ExpressReqWrap(response))
  }
}

export default mockXHR
