<template>
  <div class="right-menu">
    <!--    <div class="menu-item" @click="toggleSettings">-->
    <!--      <i class="el-icon-setting" style="font-size: 20px;" />-->
    <!--    </div>-->
    <el-dropdown trigger="click" size="medium">
      <div id="right-menu-set" class="menu-item">
        <img :src="userInfo && userInfo.avatar ? userInfo.avatar : avatarUrl" class="user-avatar">
        <span>管理员<i class="el-icon-caret-bottom" /></span>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item id="page-set" @click.native="toggleSettings">
          页面设置
        </el-dropdown-item>
        <!--        <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">-->
        <!--          <el-dropdown-item>Github</el-dropdown-item>-->
        <!--        </a>-->
        <!--        <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">-->
        <!--          <el-dropdown-item>Docs</el-dropdown-item>-->
        <!--        </a>-->
        <el-dropdown-item divided @click.native="logout">
          <span style="display: block;">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import avatarUrl from '@/assets/avatar.png'

  export default {
    data() {
      return {
        avatarUrl
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      ...mapActions({
        changeSetting: 'settings/changeSetting'
      }),
      async logout() {
        await this.$store.dispatch('user/logout')
      },
      toggleSettings() {
        const showSettings = this.$store.state.app.showSettings
        this.$store.state.app.showSettings = !showSettings
      }
    }
  }
</script>

<style lang="scss" scoped>

  .right-menu {
    display: flex;
    height: 100%;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      padding: 0 8px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .menu-item {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 10px;
      color: #fff;
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }

      .user-avatar {
        width: 30px;
        height: 30px;
        margin-right: 8px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        font-size: 12px;
      }
    }
  }
  .user-dropdown {
    min-width: 100px;
  }
</style>
<style>
  .theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
  }
</style>
