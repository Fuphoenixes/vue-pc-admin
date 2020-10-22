import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    if (!hasPermission(value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}

export function hasPermission(value) {
  const roles = store.getters && store.getters.roles
  if (value && value instanceof Array && value.length > 0) {
    const permissionRoles = value

    return roles.some(role => {
      return permissionRoles.includes(role)
    })
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']" or this.$permission(['admin', 'editor'])`)
  }
}
