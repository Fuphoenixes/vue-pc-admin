<template>
  <div class="app-container">
    <div class="app-header">
      <div class="layout3-navbar">
        <logo :collapse="false" />
        <navbar :custom-active-menu="activeMenu" :menus="menus" />
        <right-menu />
      </div>
      <tags-view v-if="needTagsView" />
    </div>
    <div class="app-container-in" :class="{nosidebar: !subMenu}">
      <div v-if="subMenu" class="app-aside">
        <div class="layout3-aside">
          <div class="subMenu-title">
            <span>{{ subMenu.title }}</span>
            <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
          </div>
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <sidebar :menus="subMenu.children" :collapse="isCollapse" />
          </el-scrollbar>
        </div>
      </div>
      <div class="app-main">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
  import Logo from '../components/Logo.vue'
  import Navbar from '../components/Navbar/index.vue'
  import Sidebar from '../components/Sidebar/index.vue'
  import RightMenu from '../components/RightMenu.vue'
  import TagsView from '../components/TagsView'
  import Hamburger from '../components/Hamburger'
  import ResizeMixin from '../mixin/ResizeHandler'

  export default {
    components: {
      Logo,
      RightMenu,
      Sidebar,
      Navbar,
      Hamburger,
      TagsView
    },
    mixins: [ResizeMixin],
    data() {
      return {
        menus: []
      }
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      needTagsView() {
        return this.$store.state.settings.tagsView
      },
      activeMenu() {
        return this.subMenu ? this.subMenu.routePath : ''
      },
      subMenu() {
        const menus = this.$store.getters.menus
        const activeMenu = '/' + this.$route.path.split('/')[1]
        const subMenu = menus.find(item => item.routePath === activeMenu) || {}
        return subMenu.children ? subMenu : null
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    created() {
      const menus = this.$store.getters.menus
      this.menus = menus.map(item => ({
        ...item,
        children: null
      }))
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
      },
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      }
    }
  }
</script>

<style lang="scss">
@import './index.scss';
</style>
