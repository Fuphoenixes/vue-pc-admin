<template>
  <div :class="classObj" class="layout-wrapper">
    <component :is="layout">
      <div id="APP_MAIN" />
    </component>
    <!-- 避免切换布局时app-main更新 -->
    <portal :target="`.${layout} #APP_MAIN`">
      <app-main />
    </portal>
    <settings />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Layout1 from './layout1/index.vue'
  import Layout2 from './layout2/index.vue'
  import Layout3 from './layout3/index.vue'
  import Layout4 from './layout4/index.vue'
  import AppMain from './components/AppMain.vue'
  import Settings from './components/Settings/index.vue'
  import Portal from '@/components/Portal'
  import { addClass, removeClass } from '@/utils/className.js'

  // 用来切换样式
  const LayoutList = ['layout1', 'layout2', 'layout3', 'layout4']

  export default {
    name: 'layout',
    components: {
      Layout1,
      Layout2,
      Layout3,
      Layout4,
      AppMain,
      Settings,
      Portal
    },
    computed: {
      ...mapState({
        sidebar: state => state.app.sidebar,
        device: state => state.app.device,
        needTagsView: state => state.settings.tagsView,
        fixedHeader: state => state.settings.fixedHeader
      }),
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          openSidebar: this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile',
          fixedHeader: this.fixedHeader,
          needTagsView: this.needTagsView
        }
      },
      layout() {
        const { layout } = this.$store.state.settings
        const body = document.body
        LayoutList.forEach(item => removeClass(body, item))
        addClass(body, layout)
        return layout
      }
    }
  }
</script>
<style lang="scss" scoped>
  .layout-wrapper {
    width: 100%;
    height: 100%;
  }
</style>
