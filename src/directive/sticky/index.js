import sticky from './sticky'

const install = function(Vue) {
  Vue.directive('sticky', sticky)
}

if (window.Vue) {
  window.sticky = sticky
  Vue.use(install); // eslint-disable-line
}

sticky.install = install
export default sticky
