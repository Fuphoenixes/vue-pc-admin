import { Message } from 'element-ui'

/**
 * 动态获取百度地图BMap
 * @param ak
 * @returns {Promise<unknown>}
 */
export const getMapScript = (ak = 'tBPMcunBdcz7bgG26l7LydiV') => {
  if (!window.BMap) {
    return new Promise((resolve, reject) => {
      const $script = document.createElement('script')
      global.document.body.appendChild($script)
      $script.src = `https://api.map.baidu.com/api?v=2.0&ak=${ak}&callback=_initBaiduMap`
      window._initBaiduMap = () => {
        resolve(window.BMap)
        global.document.body.removeChild($script)
      }
      $script.onerror = (e) => {
        reject()
        Message.error('百度地图控件加载失败，请检查网络并重试！')
      }
    })
  } else {
    return Promise.resolve(window.BMap)
  }
}

/**
 * 获取ip定位
 * @returns {Promise<unknown>}
 */
export const getLocalCity = () => new Promise((resolve, reject) => {
  getMapScript()
    .then(BMap => {
      const myCity = new BMap.LocalCity()
      myCity.get(res => {
        if (res.name) {
          resolve(res)
        } else {
          reject('定位失败')
        }
      })
    })
    .catch(reject)
})
