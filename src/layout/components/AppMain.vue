<script>
  export default {
    name: 'app-main',
    computed: {
      cachedViews() {
        // console.log(this.$store.state.tagsView.cachedViews)
        return this.$store.state.tagsView.cachedViews
      },
      key() {
        return this.$route.path
      }
    },
    watch: {
      $route: {
        handler(to) {
          if (this.$store.state.settings.tagsView || !to.name) return
          this.$store.dispatch('tagsView/noTagsAddView', to)
        },
        immediate: true
      }
    },
    render(h) {
      const { cachedViews, key } = this
      const keepAlive = (
      <keep-alive include={cachedViews}>
        <router-view key={key} />
      </keep-alive>
    )
      window.__KEEP_ALIVE__ = keepAlive
      return (
      <section
        class='app-main-container'
        id='app-main'
      >
        <transition
          name='fade-transform'
          mode='out-in'
          onBeforeLeave={() => this.$el.parentNode.style.overflow = 'hidden'}
          onAfterEnter={() => this.$el.parentNode.style.overflow = ''}
        >
          {keepAlive}
        </transition>
      </section>
    )
    }
  }
</script>

<style scoped>
.app-main-container {
  /* BFC */
  float: left;
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
