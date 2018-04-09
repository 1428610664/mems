<template>

  <div class="content">
    <div class="my-head ct">
      <div class="portrait"><img v-lazy="loadImg" width="100%" height="100%"/></div>
      <p class="name fz14 c"><span id="dept-dame">{{user.user.name}}</span> / <span class="c" id="username">{{user.user.userName}}</span></p>
      <div class="big-bg" :style="bgStyle"></div>
    </div>
    <ul class="mlistbox fz16 c4">
      <router-link to="/test" tag="li" class="mlist">
        <i class="icon fz20 c1 iconfont icon-shezhi"></i>
        <span>设置</span>
        <span class="num c btnR fr fz12 hide"></span>
        <i class="i_more iconfont icon-arrowright"></i>
      </router-link>
      <router-link to="/test" tag="li" class="mlist">
        <i class="icon fz20 c1 iconfont icon-shouquan"></i>
        <span>转授权</span>
        <span class="num c btnR fr fz12 hide"></span>
        <i class="i_more iconfont icon-arrowright"></i>
      </router-link>
      <li class="mlist" @click="toLogin">
        <i class="icon fz20 c1 iconfont icon-caozuo_zhuxiao_tuichudenglu"></i>
        <span>注销</span>
        <span class="num c btnR fr fz12 hide"></span>
        <i class="i_more iconfont icon-arrowright"></i>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>

  import {mapMutations, mapGetters} from 'vuex'

  export default {
    data() {
      return {
        name: "张三",
        account: "000001",
        loadImg: "http://www.qqzhi.com/uploadpic/2015-01-28/202128541.jpg",
      }
    },
    methods: {
      ...mapMutations({
        setIsLogin: 'SET_ISLOGIN',
        setUserData: 'SET_USERDATA'
      }),
      toLogin(){
        let _this = this
        this.$vux.confirm.show({
          title: '提示',
          content: '确认注销登录？',
          onConfirm () {
            _this.$vux.toast.text("退出", "bottom")
            _this.setIsLogin(false)
          }
        })
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.loadImg})`
      },
      user(){
        return this.userData
      },
      ...mapGetters([
        'userData',
      ])
    },
  }
</script>

<style scoped>

  .big-bg{
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    -webkit-filter: blur(10px);
    filter: blur(10px);
    opacity: .6;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
  }

  .content {
    position: fixed;
    top: 46px;
    bottom: 50px;
    left: 0;
    z-index: 15;
    width: 100%;
    overflow: auto;
  }

  .recommend-content {
    overflow: hidden;
    height: 100%;
  }

  .my-head {
    padding: 40px 0;
    position: relative;
    background: rgba(0,0,0,.35);
    overflow: hidden;
  }

  .my-head .portrait {
    margin: 0 auto 8px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
  }

  .mlistbox:nth-last-child(1) .mlist:nth-child(n+2):before {
    left: calc(3% + 30px);
  }

  .mlistbox .num {
    margin: 14px 0;
    display: inline-block;
    padding: 1px 7px;
    line-height: 18px;
    border-radius: 20px;
  }

</style>
