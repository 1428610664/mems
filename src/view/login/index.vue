<template>
  <transition name="move">
    <div class="login-wrapper b">
      <div class="content-wrapper" id="content">
        <div class="line-wrapper inp">
          <i class="icon iconfont icon-custom-user c4 fz22"></i>
          <input type="text" v-model="name" maxlength="11" @keyup.13="login" placeholder="登录账号">
        </div>
        <div class="line-wrapper inp">
          <i class="icon iconfont icon-icon-mima c4 fz22"></i>
          <input type="password" v-show="pswMark" v-model="password" maxlength="12" @keyup.13="login" placeholder="密码">
          <input type="text" v-show="!pswMark" v-model="password" maxlength="12" @keyup.13="login" placeholder="密码">
          <div class="hzlabel1">
            <div mark="0" class="hzradio radio fz22 iconfont icon-chakanyanjingshishifenxi2"
                 :class="{c1: !pswMark, c4: pswMark}"
                 @click="showpsw"></div>
          </div>
        </div>
        <div class="line-wrapper">
          <button class="login b1 c fz14 btn-active" @click="login">登录</button>
        </div>
        <div class="line-wrapper clear">
          <a href="javascript:void(0)" class="fl c4">忘记密码?</a>
          <a href="javascript:void(0)" class="fr c1">注册新账号</a>
        </div>
      </div>
      <footer class="copyright c2 ct fz12" id="foot">Copyright ©广州科微软件有限公司</footer>
    </div>
  </transition>
</template>

<script>

  import hz_util from 'common/js/utils'
  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'

  import {mapMutations} from 'vuex'
  import {setUserInfo, setIsLogin} from 'common/js/cache'
  export default {
    name: "index",
    data() {
      return {
        pswMark: true,
        name: "",
        password: ''
      }
    },
    created() {
      setTimeout(() => {
        let content = document.getElementById("content")
        let foot = document.getElementById("foot")
        hz_util.posDom(foot, content, 150)
      }, 20)
    },
    methods: {
      ...mapMutations({
        setIsLogin: 'SET_ISLOGIN',
        setUserData: 'SET_USERDATA'
      }),
      showpsw(e) {
        this.pswMark = !this.pswMark
      },
      login() {
        if (hz_util.isEmpty(this.name)) {
          this.$vux.toast.text("账号不能为空", "bottom")
          return
        }
        if (hz_util.isEmpty(this.password)) {
          this.$vux.toast.text("密码不能为空", "bottom")
          return
        }
        if (this.loginMark) return
        this.loginMark = true
        let reqData = {userName: this.name, passWord: this.password}
        this.$vux.loading.show({text: '登录中...'})
        request.post(getUrl("login"), reqData).then((data) => {
          this.loginMark = false
          this.$vux.loading.hide()
          if (!data.success) {
            this.$vux.toast.text(data.desc, "bottom")
            return
          }
          this.password = ''
          this.setIsLogin(true)
          this.setUserData(data.data)

          setIsLogin(true)
          setUserInfo(data.data)
        }, (error) => {
          this.loginMark = false
          this.$vux.loading.hide()
        })
      }
    }
  }
</script>

<style scoped>

  .login-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 200;
    height: 100%;
    overflow-y: auto;
  }

  .login-wrapper .content-wrapper {
    margin-top: 150px;
    padding: 0 5%;
  }

  .line-wrapper.inp {
    position: relative;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #EBEEF5;
  }

  .line-wrapper .icon {
    margin: 0 10px 0 5px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    display: inline-block;
    vertical-align: middle;
  }

  .line-wrapper input {
    border: none;
    width: calc(100% - 80px);
    height: 42px;
    vertical-align: middle;
  }

  .line-wrapper .login {
    margin: 10px 0 15px;
    width: 100%;
    height: 42px;
    border: none;
    border-radius: 5px;
  }

  .hzlabel1 {
    position: absolute;
    top: 0;
    right: 10px;
  }

  .copyright {
    width: 100%;
    line-height: 40px;
  }


</style>
