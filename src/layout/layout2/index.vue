<template>
  <div class="app-container">
    <div class="app-header">
      <div class="layout2-navbar">
        <logo :collapse="false" />
        <navbar :menus="menus" />
        <right-menu />
      </div>
      <tags-view v-if="needTagsView" />
    </div>
    <div class="app-main">
      <slot />
    </div>
  </div>
</template>

<script>
  import Logo from '../components/Logo.vue'
  import Navbar from '../components/Navbar/index.vue'
  import RightMenu from '../components/RightMenu.vue'
  import TagsView from '../components/TagsView'
  // import ResizeMixin from '../mixin/ResizeHandler'

  export default {
    components: {
      Logo,
      RightMenu,
      Navbar,
      TagsView
    },
    // mixins: [ResizeMixin],
    computed: {
      menus() {
        return this.$store.getters.menus
      },
      needTagsView() {
        return this.$store.state.settings.tagsView
      }
    }
  }
</script>

<style lang="scss">
@import './index.scss';
</style>
