import defaultSettings from '@/settings'
import store from '@/store'

export default function getPageTitle(pageTitle) {
  const title = store.getters.settings.title || defaultSettings.title
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
