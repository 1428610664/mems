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
  import {numberMixin} from "common/mixin/numberMixin"

  const title = {home: "主页", message: "消息", me: "我"}

  export default {
    mixins: [numberMixin],
    data() {
      return {
        title: this.$route.path.substring(1) ? title[this.$route.path.substring(1)]: "主页"
      }
    },
    computed: {
      ...mapGetters([
        'isLogin',
        'userData'
      ])
    },
    created() {
      this.getNumber()
      setInterval(() => {
        this.getNumber()
      }, 10000)
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
      }
    },
    watch: {
      isLogin(login){
        console.log("登录状态改变："+login)
        if(login) {
          this.$router.replace({path:"/home"})
        }else{
          this.$router.replace({path:"/login"})
        }
        setIsLogin(login)
      },
      userData(newData){
        setUserInfo(newData)
      },
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';

  body {
    background-color: #fbf9fe;
  }
</style>
