<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" :watch-data="visitedTags" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedTags"
        ref="tag"
        :key="tag.routeName"
        :class="isActive(tag)?'active':''"
        :to="tag.routePath"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags(selectedTag)">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script>
  import ScrollPane from './ScrollPane'
  import Sortable from 'sortablejs'

  export default {
    components: { ScrollPane },
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        affixTags: []
      }
    },
    computed: {
      visitedTags() {
        return this.$store.state.tagsView.visitedTags
      }
    },
    watch: {
      $route() {
        // console.log(this.$store.state.tagsView.cachedViews)
        // console.log(this.$store.state.tagsView.visitedTags)
        this.addTags()
        this.moveToCurrentTag()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted() {
      this.addTags()
      this.setSort()
    },
    methods: {
      isActive(tag) {
        return tag.routePath === this.$route.fullPath
      },
      isAffix(tag) {
        const { affixTags } = this.$store.state.tagsView
        return affixTags.some(t => t.routeName === tag.routeName)
      },
      addTags() {
        const { name } = this.$route
        if (name) {
          this.$store.dispatch('tagsView/addView', this.$route)
        }
        return false
      },
      moveToCurrentTag() {
        const tags = this.$refs.tag
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to === this.$route.fullPath) {
              this.$refs.scrollPane.moveToTarget(tag)
              break
            }
          }
        })
      },
      refreshSelectedTag(tag) {
        const fullPath = tag.routePath
        this.$store.commit('tagsView/DEL_CACHED_VIEW', tag.routeName)
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      },
      closeSelectedTag(tag) {
        this.$store.dispatch('tagsView/delTag', tag).then(({ visitedTags }) => {
          if (this.isActive(tag)) {
            this.toLastView(visitedTags, tag)
          }
        })
      },
      closeOthersTags(tag) {
        this.$router.push(tag.routePath)
        this.$store.dispatch('tagsView/delOthersTags', tag)
        this.moveToCurrentTag()
      },
      closeAllTags() {
        this.$store.dispatch('tagsView/delAllTags')
        // 关完还剩下的
        const { visitedTags } = this.$store.state.tagsView
        const lastTag = visitedTags[visitedTags.length - 1]
        if (lastTag) {
          if (this.$route.fullPath !== lastTag.routePath) {
            this.$router.push(lastTag.routePath)
          }
        } else {
          if (this.$route.name === 'dashboard') {
            // to reload home page
            this.$router.replace({ path: '/redirect' + this.$route.path })
          } else {
            this.$router.push('/')
          }
        }
      },
      toLastView(visitedTags, view) {
        const latestTag = visitedTags.slice(-1)[0]
        if (latestTag) {
          this.$router.push(latestTag.routePath)
        } else {
          // now the default is to redirect to the home page if there is no tags-view,
          // you can adjust it according to your needs.
          if (view.name === 'dashboard') {
            // to reload home page
            this.$router.replace({ path: '/redirect' + view.routePath })
          } else {
            this.$router.push('/')
          }
        }
      },
      openMenu(tag, e) {
        const menuMinWidth = 105
        const windowWidth = document.documentElement.clientWidth
        const maxLeft = windowWidth - menuMinWidth // left boundary
        const left = e.clientX + 15 // 15: margin right

        if (left > maxLeft) {
          this.left = maxLeft
        } else {
          this.left = left
        }

        this.top = e.clientY
        this.visible = true
        this.selectedTag = tag
      },
      closeMenu() {
        this.visible = false
      },
      setSort() {
        const el = this.$refs.scrollPane.$el.querySelector('.el-scrollbar__view')
        this.sortable = Sortable.create(el, {
          ghostClass: 'tags-view-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            dataTransfer.setData('Text', '')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tags-view-container {
    width: 100%;
    height: 34px;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .tags-view-wrapper {
      .tags-view-item {
        position: relative;
        display: inline-block;
        height: 26px;
        padding: 0 8px;
        margin-top: 4px;
        margin-left: 5px;
        font-size: 12px;
        line-height: 26px;
        color: #409eff;
        cursor: pointer;
        background: #fff;
        border: 1px solid #d9ecff;
        border-radius: 3px;
        &:first-of-type {
          margin-left: 15px;
        }
        &:last-of-type {
          margin-right: 15px;
        }
        &.active {
          color: #fff;
          background-color: #409EFF;
          border-color: #409EFF;
          &::before {
            position: relative;
            display: inline-block;
            width: 8px;
            height: 8px;
            margin-right: 2px;
            background: #fff;
            border-radius: 50%;
            content: '';
          }
        }
      }
    }
    .contextmenu {
      position: fixed;
      z-index: 3000;
      padding: 5px 0;
      margin: 0;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      list-style-type: none;
      background: #fff;
      border-radius: 4px;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
      li {
        padding: 7px 16px;
        margin: 0;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<style lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        width: 16px;
        height: 16px;
        font-size: 18px;
        line-height: 16px;
        text-align: center;
        vertical-align: -3px;
        border-radius: 50%;
        // transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        &::before {
          display: inline-block;
          transform: scale(0.6) translateX(-2px);
        }
        &:hover {
          color: #fff;
          background-color: rgba(0, 0, 0, 0.25);
        }
      }
    }
  }
  .tags-view-ghost {
    color: transparent !important;
    background: transparent !important;
    border: 2px dashed $themeColor !important;
    & * {
      visibility: hidden;
    }
  }
</style>
