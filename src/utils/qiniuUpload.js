import { Message } from 'element-ui'
import * as qiniu from 'qiniu-js'
import { uploadGetToken } from '@/api'
import { mergeAsyncFunc } from '@/utils/mergeAsyncFunc'

/**
 * 获取七牛配置
 * @returns {Promise<{ token, domain }>}
 */
const getQiniuParams = async() => {
  const res = await mergeAsyncFunc(uploadGetToken)
  return res.data
}

/**
 * 生成唯一key值
 * @param fileName
 * @returns {string}
 * @private
 */
const _getKey = (fileName) => {
  let key = (new Date().getTime() + '' + ((Math.random() * 1000) | 0)).substring(8)
  const arr = fileName.split('.')
  if (arr.length > 1) {
    key = arr[0].substr(0, 4) + key + '.' + arr[arr.length - 1]
  } else {
    key = arr[0].substr(0, 4) + key
  }
  return key
}

/**
 * 七牛上传图片
 * @param file
 * @param domain
 * @param token
 * @param prefixKey
 * @param percentCallBack
 * @returns {Promise<string>} url
 */
const qiniuUpload = ({
  file,
  domain,
  token,
  prefixKey = '',
  percentCallBack = () => {}
}) => new Promise((resolve, reject) => {
  const config = {
    useCdnDomain: true,
    region: qiniu.region.z0
  }
  const key = prefixKey + _getKey(file.name)
  const observable = qiniu.upload(file, key, token, {}, config)
  observable.subscribe({
    next(res) {
      percentCallBack(res.total.percent)
    },
    error(err) {
      reject(err)
    },
    complete(res) {
      resolve(domain + res.key)
    }
  })
})

/**
 * 上传
 * @param file
 * @param prefixKey
 * @param percentCallBack
 * @param limitSize
 * @returns {Promise<string>} url
 */
const upload = async({
  file,
  prefixKey = '',
  percentCallBack,
  limitSize = 15
}) => {
  if (file.size > limitSize * 1024 * 1024) {
    Message({
      message: `单张图片请不要超过${limitSize}M`,
      type: 'warning'
    })
    return Promise.reject('图片过大')
  }
  // eslint-disable-next-line prefer-const
  let { domain, token } = await getQiniuParams()
  if (domain.lastIndexOf('/') !== domain.length - 1) {
    domain += '/'
  }
  return await qiniuUpload({ file, domain, token, prefixKey, percentCallBack })
}

export default upload
