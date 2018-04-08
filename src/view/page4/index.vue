<template>

  <div class="content">
    <div class="my-head ct">
      <div class="portrait"><img v-lazy="loadImg" width="100%" height="100%"/></div>
      <p class="name fz14"><span id="dept-dame">123</span>：<span class="c1" id="username">456</span>
      </p>
    </div>
    <ul class="mlistbox fz16 c4">
      <router-link to="/test" tag="li" class="mlist">
        <i class="icon fz20 c1 iconfont icon-youxiang1"></i>
        <span>公告通知</span>
        <span class="num c btnR fr fz12">3</span>
        <i class="i_more iconfont icon-jiantou1"></i>
      </router-link>
    </ul>
    <ul class="mlistbox fz16 c4">
      <router-link to="/test" tag="li" class="mlist">
        <i class="icon fz20 c1 iconfont icon-youxiang1"></i>
        <span>公告通知</span>
        <span class="num c btnR fr fz12">3</span>
        <i class="i_more iconfont icon-jiantou1"></i>
      </router-link>
    </ul>
      <router-view></router-view>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        loadImg: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2110730658,1124716487&fm=173&app=12&f=JPEG?w=218&h=146&s=B720B80932631CB6461FF048030030E0",
      }
    },
    methods: {

    },
    computed: {
    }
  }
</script>

<style scoped>
  .content {
    position: fixed;
    top: 46px;
    bottom: 50px;
    left: 0;
    z-index: 15;
    width: 100%;
    overflow:auto;
  }

  .recommend-content {
    overflow: hidden;
    height: 100%;
  }

  .my-head {
    padding: 40px 0;
    background: #8aa0d0;
  }

  .my-head .portrait {
    margin: 0 auto 8px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
  }

  .mlistbox:nth-last-child(1) .mlist:nth-child(n+3):before {
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
