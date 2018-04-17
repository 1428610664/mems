<template>
  <div id="app" @touchmove.prevent>
    <x-header :left-options="{backText: '', showBack: false}" :title="title"></x-header>
    <div class="content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <v-footer @change-title="check"></v-footer>
  </div>
</template>

<script>

  import {XHeader} from 'vux'
  import footer from 'components/footer/footer'
  import {mapGetters, mapMutations} from 'vuex'
  import {setIsLogin, setUserInfo} from 'common/js/cache'
  import {initBack} from 'common/js/H5Utils'
  import {numberMixin} from "common/mixin/numberMixin"
  import {authorizeMixin} from 'common/mixin/authorizeMixin'

  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'

  export default {
    mixins: [numberMixin, authorizeMixin],
    data() {
      return {
        timer: null,
        title: "主页"
      }
    },
    computed: {
      ...mapGetters([
        'isLogin',
        'userData',
        'authorize'
      ])
    },
    created() {
      setTimeout(() => {
        initBack()
        if(window.plus)console.log("【created】this.isLogin："+this.isLogin)
        if(!this.isLogin){
          this.$router.replace({path:"/login"})
        }
        this.getNumber()
      }, 20)
    },
    components: {
      XHeader,
      'v-footer': footer
    },
    methods: {
      ...mapMutations({
        setAuthorize: "SET_AUTHORIZE"
      }),
      check(t) {
        this.title = t;
      },
      getNumber(){
        if(this.isLogin){
          // 定时任务获取授权信息
          this.getAuthorizeToUser()
          // 获取首页服务请求、人功报障number
          this.getServiceNumber()
          this.getFaultsNumber()
          this.getEventsNumber()
        }
        if(this.timer) clearInterval(this.timer)
        this.timer = setInterval(() => {
          if(this.isLogin){
            // 定时任务获取授权信息
            this.getAuthorizeToUser()
            // 获取首页服务请求、人功报障number
            this.getServiceNumber()
            this.getFaultsNumber()
            this.getEventsNumber()
          }
        }, 10000)
      },
      getAuthorizeToUser(){
        request.get(getUrl("authorizeToUser"), {}).then( res => {
          if(res.success){
            if(res.data.rows.length > 0){
              this.setAuthorize({data: res.data.rows[0]})
              this.confirmAuthorize()
            }
          }
        }, error => {
        })
      }
    },
    watch: {
      isLogin(login){
        console.log("登录状态改变："+login)
        if(login) {
          this.$router.replace({path:"/home"})
          this.getNumber()
        }else{
          this.$router.replace({path:"/login"})
        }
        setIsLogin(login)
      },
      userData(newData){
        setUserInfo(newData)
      },
      authorize(authorize){
        if(authorize){
          this.confirmAuthorize()
        }
      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';

  body {
    background-color: #fbf9fe;
  }
</style>
