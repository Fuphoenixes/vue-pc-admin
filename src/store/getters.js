
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  settings: state => state.settings,
  routes: state => state.permission.routes,
  menus: state => state.permission.menus
}
export default getters
