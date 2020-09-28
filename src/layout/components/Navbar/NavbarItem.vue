<template>
  <el-menu-item v-if="!item.children || item.children.every(it=>it.hidden)" :index="item.routePath || item.url">
    <app-link :to="to(item)">
      <item :icon="item.icon" :title="item.title" />
    </app-link>
  </el-menu-item>
  <el-submenu v-else :class="{'no-arrow': item.title === '...'}" :index="item.routePath">
    <span slot="title">
      <item :icon="item.icon" :title="item.title" />
    </span>
    <navbar-item
      v-for="(child,idx) in item.children"
      :key="idx"
      :index="idx"
      :item="child"
    />
  </el-submenu>
</template>

<script>
  import Item from './Item.vue'
  import AppLink from '../Sidebar/Link.vue'

  export default {
    name: 'navbar-item',
    components: { Item, AppLink },
    props: {
      item: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: true
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
<style>
	.el-menu--horizontal .svg-icon{
		margin-right: 8px;
		vertical-align: middle;
	}
</style>
<style lang="scss" scoped>
	.no-arrow /deep/ .el-submenu__title{
		font-weight: bold;
		width: 60px;
		text-align: center;
		i{
			display: none;
		}
	}
</style>
