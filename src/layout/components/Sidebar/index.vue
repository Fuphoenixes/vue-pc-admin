<template>
  <div class="sidebar-container">
    <el-menu
      :default-active="activeMenu"
      :collapse="collapse"
      :collapse-transition="false"
      unique-opened
    >
      <sidebar-item v-for="(item,index) in menus" :key="index" :item="item" :index="index" />
    </el-menu>
  </div>
</template>

<script>
  import SidebarItem from './SidebarItem'

  export default {
    components: { SidebarItem },
    props: {
      menus: {
        type: Array,
        default: []
      },
      collapse: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      activeMenu() {
        if (this.$route.meta.activeMenu) {
          return this.$route.meta.activeMenu
        }
        return this.$route.path
      }
    }
  }
</script>
<style lang="scss" scoped>
	@import './sidebar.scss';
</style>
