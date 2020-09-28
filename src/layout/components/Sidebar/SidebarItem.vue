<template>
  <div>
    <template v-if="!item.children || item.children.every(it=>it.hidden)">
      <app-link :to="to(item)">
        <el-menu-item :index="item.routePath" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="item.icon" :title="item.title" />
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else ref="subMenu" :index="item.routePath" popper-append-to-body>
      <template slot="title">
        <item :icon="item.icon" :title="item.title" />
      </template>
      <sidebar-item
        v-for="(child,idx) in item.children"
        :key="idx"
        :index="idx"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
  import Item from './Item'
  import AppLink from './Link'
  import FixiOSBug from './FixiOSBug'

  export default {
    name: 'sidebar-item',
    components: { Item, AppLink },
    mixins: [FixiOSBug],
    props: {
      item: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      to(menuItem) {
        const visitedTags = this.$store.state.tagsView.visitedTags
        const tag = visitedTags.find(t => t.routeName === menuItem.routeName)
        return tag ? tag.routePath : menuItem.routePath
      }
    }
  }
</script>
