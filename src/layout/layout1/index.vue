<template>
  <div class="app-container">
    <!--    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />-->
    <div class="app-aside">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="layout1-aside">
          <logo :collapse="!sidebar.opened" />
          <sidebar :collapse="isCollapse" :menus="menus" />
        </div>
      </el-scrollbar>
    </div>
    <div class="app-main">
      <div class="app-header-in">
        <div class="layout1-navbar">
          <div class="navbar-left">
            <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
            <breadcrumb class="breadcrumb-container" />
          </div>
          <right-menu />
        </div>
        <tags-view v-if="needTagsView" />
      </div>
      <div class="app-main-in">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
  import Logo from '../components/Logo.vue'
  import Sidebar from '../components/Sidebar/index.vue'
  import TagsView from '../components/TagsView'
  import RightMenu from '../components/RightMenu.vue'
  import Breadcrumb from '../components/Breadcrumb'
  import Hamburger from '../components/Hamburger'
  import ResizeMixin from '../mixin/ResizeHandler'

  export default {
    name: 'layout1',
    components: {
      Logo,
      RightMenu,
      Sidebar,
      Breadcrumb,
      Hamburger,
      TagsView
    },
    mixins: [ResizeMixin],
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      menus() {
        return this.$store.getters.menus
      },
      isCollapse() {
        return !this.sidebar.opened
      },
      needTagsView() {
        return this.$store.state.settings.tagsView
      },
      device() {
        return this.$store.state.app.device
      }
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
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 99;
  }
</style>
