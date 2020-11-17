<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <router-link key="collapse" class="sidebar-logo-link" to="/">
      <!--      <img v-if="logo" :src="logo" class="sidebar-logo">-->
      <svg-icon icon-class="logo" class="sidebar-logo" />
      <transition name="sidebarLogoFade">
        <h1
          v-show="!collapse"
          class="sidebar-title"
          :style="{ fontSize: settings.layout === 'layout1' && settings.title.length >= 8 ? '14px' : '18px'}"
        >{{ settings.title }} </h1>
      </transition>
    </router-link>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'sidebar-logo',
    props: {
      collapse: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      ...mapGetters(['settings'])
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
  }

  .sidebarLogoFade-enter,
  .sidebarLogoFade-leave-to {
    opacity: 0;
  }

  .sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 60px;
    padding-left: 20px;
    overflow: hidden;
    line-height: 60px;

    & .sidebar-logo-link {
      width: 100%;
      height: 100%;

      & .sidebar-logo {
        width: 32px;
        height: 32px;
        margin-right: 8px;
        color: #fff;
        vertical-align: middle;
      }

      & .sidebar-title {
        display: inline-block;
        margin: 0;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        font-size: 18px;
        font-weight: 600;
        line-height: 50px;
        color: #fff;
        vertical-align: middle;
      }
    }

    &.collapse {
      padding-left: 10px;
    }
  }
</style>
