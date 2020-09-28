<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <router-link key="collapse" class="sidebar-logo-link" to="/">
      <!--      <img v-if="logo" :src="logo" class="sidebar-logo">-->
      <svg-icon icon-class="logo" class="sidebar-logo" />
      <transition name="sidebarLogoFade">
        <h1 v-show="!collapse" class="sidebar-title">{{ settings.title }} </h1>
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
    line-height: 60px;
    padding-left: 20px;
    overflow: hidden;

    & .sidebar-logo-link {
      height: 100%;
      width: 100%;

      & .sidebar-logo {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        margin-right: 8px;
        color: #fff;
      }

      & .sidebar-title {
        display: inline-block;
        margin: 0;
        color: #fff;
        font-weight: 600;
        line-height: 50px;
        font-size: 18px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
      }
    }

    &.collapse {
      padding-left: 10px;
    }
  }
</style>
