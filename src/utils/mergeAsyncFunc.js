// 缓存对象 des:用于缓存调用过的函数的结果
let mergeCache = {}

// 合并异步函数 des:若参数相同且第一次调用成功则不会重复调用函数，而是直接返回第一次的结果
export function mergeAsyncFunc(fn, ...args) {
  return new Promise((resolve, reject) => {
    const key = fn.name + '__' + JSON.stringify(args)
    // 第一次调用
    if (!mergeCache[key]) {
      mergeCache[key] = {
        state: 'doing', // 表示处理中
        resolveList: [],
        rejectList: []
      }
      fn.apply(null, args)
        .then(res => {
          resolve(res)
          if (!mergeCache[key]) return
          mergeCache[key].state = 'done'
          mergeCache[key].res = res
          mergeCache[key].resolveList.forEach((item) => item(res))
        })
        .catch(err => {
          reject(err)
          if (!mergeCache[key]) return
          mergeCache[key].rejectList.forEach((item) => item(err))
          mergeCache[key] = null
        })
      // 重复调用
    } else {
      if (mergeCache[key].state === 'done') resolve(mergeCache[key].res)
      else {
        mergeCache[key].resolveList.push((res) => {
          resolve(res)
        })
        mergeCache[key].rejectList.push((err) => {
          reject(err)
        })
      }
    }
  })
}

// 清除对应的缓存  参数支持： 不传 ， 字符串， 数组
export function clearCache(name) {
  if (!name) mergeCache = {}
  for (const key in mergeCache) {
    if (mergeCache.hasOwnProperty(key)) {
      if (typeof name === 'string') {
        if (key.indexOf(name) === 0) {
          mergeCache[key] = null
        }
      }
      if (typeof name === 'object') {
        for (let i = 0; i < name.length; i++) {
          if (key.indexOf(name[i]) === 0) {
            mergeCache[key] = null
            break
          }
        }
      }
    }
  }
}

