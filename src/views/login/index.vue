<template>
  <div class="login-container">
    <div class="title-container">
      <div class="title">
        <svg-icon icon-class="logo" />
        <span>{{ title }}</span>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="tabs">
      <el-tab-pane label="账户密码登录" name="1" />
      <el-tab-pane label="手机号登录" name="2" />
    </el-tabs>

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <el-form-item v-if="activeTab === '1'" prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="user" />
        </el-input>
      </el-form-item>
      <el-form-item v-if="activeTab === '1'" prop="password">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" />
          <span slot="suffix" class="svg-container" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-input>
      </el-form-item>

      <el-form-item v-if="activeTab === '2'" prop="phone">
        <el-input
          ref="username"
          v-model="loginForm.phone"
          placeholder="手机号"
          name="phone"
          type="text"
          tabindex="1"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="phone" />
        </el-input>
      </el-form-item>
      <el-form-item v-if="activeTab === '2'" class="yzm-form-item" prop="code">
        <el-input
          ref="username"
          v-model="loginForm.code"
          placeholder="验证码"
          name="code"
          type="text"
          tabindex="1"
          autocomplete="off"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="yzm" />
        </el-input>
        <el-button size="medium" plain>获取验证码</el-button>
      </el-form-item>

      <el-button class="submit-btn" size="medium" :loading="loading || NProgress.status" type="primary" @click.native.prevent="handleLogin">登 录</el-button>

    </el-form>
    <div class="other-login">
      <div>
        其他登录方式
        <svg-icon icon-class="wechat" />
      </div>
      <!--      <el-checkbox v-model="checked">记住密码</el-checkbox>-->
    </div>
    <div class="copy-right">
      Copyright <svg-icon icon-class="copyright" />  2020 多立恒(北京)信息技术有限公司
    </div>
  </div>
</template>

<script>
  import defaultSettings from '@/settings'
  import NProgress from 'nprogress'

  export default {
    name: 'login',
    data() {
      return {
        title: defaultSettings.title,
        activeTab: '1',
        loginForm: {
          username: 'admin',
          password: '123456',
          phone: '',
          code: ''
        },
        loginRules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
        NProgress: NProgress
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-container {
    position: relative;
    min-height: 100%;
    width: 100%;
    background-color: #f0f2f5;
    background-image: url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;
    overflow: hidden;
    color: #5a5e66;

    .title-container {
      position: relative;
      width: 368px;
      max-width: 100%;
      padding: 100px 0 0;
      margin: 0 auto;
      .title {
        color: rgba(0,0,0,.85);
        font-weight: 600;
        font-size: 33px;
        text-align: center;
        margin-bottom: 20px;
        & /deep/ .svg-icon{
          color: $themeColor;
        }
        .logo {
          width: 46px;
          height: 46px;
          margin-right: 10px;
          vertical-align: middle;
        }
      }
    }

    .tabs {
      position: relative;
      width: 368px;
      max-width: 100%;
      margin: 0 auto;
      & /deep/ .el-tabs__nav-wrap {
        &:after{
          display: none;
        }
        .el-tabs__nav-scroll{
          display: flex;
          justify-content: center;
        }
      }
    }

    .login-form {
      position: relative;
      width: 368px;
      max-width: 100%;
      padding: 20px 0 0;
      margin: 0 auto;
      overflow: hidden;
      & /deep/ .el-input {
        input {
          height: 40px;
          line-height: 40px;
          padding-left: 40px;
          padding-right: 40px;
          border-radius: 0;
        }
        .el-input__prefix, .el-input__suffix {
          line-height: 40px;
          width: 40px;
          color: $themeColor;
          .svg-icon{
            font-size: 16px;
            vertical-align: -0.25em;
          }
        }
        .el-input__prefix{
          left: 0;
        }
        .el-input__suffix{
          right: 0;
        }
      }
    }

    .other-login {
      position: relative;
      width: 368px;
      max-width: 100%;
      margin: 0 auto;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & /deep/ .svg-icon{
        font-size: 24px;
        margin-left: 10px;
        vertical-align: -0.25em;
      }
    }

    .copy-right {
      font-size: 14px;
      text-align: center;
      position: absolute;
      bottom: 10px;
      width: 100%;
    }

    .yzm-form-item {
      & /deep/ .el-form-item__content{
        display: flex;
        .el-button{
          border-radius: 0;
          margin-left: 10px;
        }
      }
    }

    .svg-container {
      color: $themeColor;
      vertical-align: middle;
      width: 40px;
      display: inline-block;
      cursor: pointer;
    }

    .submit-btn {
      width:100%;
      margin-bottom:20px;
      border-radius: 0;
    }
  }

</style>
