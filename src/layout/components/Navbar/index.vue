<template>
  <div class="navbar-menu">
    <el-menu
      :default-active="customActiveMenu || activeMenu"
      unique-opened
      mode="horizontal"
    >
      <navbar-item v-for="(item,index) in renderMenu" :key="index" :item="item" :index="index" />
    </el-menu>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import NavbarItem from './NavbarItem'
  import variables from '@/styles/variables.scss'
  import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

  export default {
    components: { NavbarItem },
    props: {
      menus: {
        type: Array,
        default: []
      },
      customActiveMenu: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        renderMenu: []
      }
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      activeMenu() {
        if (this.$route.meta.activeMenu) {
          return this.$route.meta.activeMenu
        }
        return this.$route.path
      },
      variables() {
        return variables
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    watch: {
      menus() {
        this.setMenus()
      }
    },
    mounted() {
      setTimeout(() => {
        this.setMenus()
      }, 200)
      addResizeListener(this.$el, this.setMenus)
    },
    beforeDestroy() {
      removeResizeListener(this.$el, this.setMenus)
    },
    methods: {
      setMenus() {
        const wrapperW = this.$el.offsetWidth
        const topMenu = []
        const otherMenu = []
        let nowW = 0
        this.menus.forEach(item => {
          nowW += this.getItemW(item)
          if (nowW + 100 > wrapperW) {
            otherMenu.push(item)
          } else {
            topMenu.push(item)
          }
        })
        if (otherMenu.length > 0) {
          topMenu.push({
            title: '...',
            routePath: '/',
            children: otherMenu
          })
        }
        this.renderMenu = topMenu
      },
      getItemW(item) {
        // 20 14 8
        let w = 0
        if (item.icon) w += 22
        w += item.title.length * 14
        w += 40
        return w
      }
    }
  }
</script>
<style lang="scss" scoped>
  .navbar-menu{
    flex: 1;
    & /deep/ .el-menu.el-menu--horizontal{
      border-bottom: none;
      display: flex;
      .el-submenu__title{
        border-bottom-width: 2px;
        border-bottom-style: solid;
      }
    }
    & /deep/ .el-menu-item{
      padding: 0;
      &>a{
        display: inline-block;
        width: 100%;
        height: 100%;
        padding: 0 20px;
      }
    }
  }
</style>
