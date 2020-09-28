/**
 * 检查一个元素是否含有某个Class
 * @param  {HTMLElement} ele
 * @param  {String} className
 * @return {Boolean}
 */
export function hasClass(ele, className) {
  const exp = new RegExp('\\b(' + className + ')\\b')
  return exp.test(ele.className)
}

/**
 * 添加Class(需hasClass函数支持)
 * @param {HTMLElement} ele
 * @param {String} cls
 */

export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) {
    ele.className += ' ' + cls
  }
}

/**
 * 删除Class(需hasClass函数支持)
 * @param {HTMLElement} ele
 * @param {String} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const exp = new RegExp('\\b(' + cls + ')\\b')
    ele.className = ele.className.replace(exp, ' ')
  }
}

/**
 * 如果一个元素有某个Class，则删除这个Class，否则添加(需hasClass、trim函数支持)
 * @param  {HTMLElement} ele
 * @param  {String}      className
 */
export function toggleClass(ele, className) {
  if (hasClass(ele, className)) {
    ele.className = ele.className.replace(className, '')
  } else {
    ele.className += ' ' + className
  }
  ele.className = ele.className.trim()
}
