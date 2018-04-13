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

        // 定时任务获取授权信息
      }, 20)
    },
    components: {
      XHeader,
      'v-footer': footer
    },
    methods: {
      check(t) {
        this.title = t;
      },
      getNumber(){
        this.getServiceNumber()
        this.getFaultsNumber()
        if(this.timer) clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.getServiceNumber()
          this.getFaultsNumber()
        }, 10000)
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
