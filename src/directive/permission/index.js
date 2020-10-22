import permission, { hasPermission } from './permission'

const install = function(Vue) {
  Vue.directive('permission', permission)
  Vue.prototype.$permission = hasPermission
}

if (window.Vue) {
  window['permission'] = permission
  Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission
