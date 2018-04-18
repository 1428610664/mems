<template>

  <div>
    <ul class="grid-wrapper clear">
      <router-link to="/serviceRequest" tag="li" class="grid posct">
        <div>
          <div class="icon iconfont posct icon-fuwuqingqiu fz24 mb1"><i class="number fz12">{{servicesNumber}}</i></div>
          <div class="name ct">服务请求</div>
        </div>
      </router-link>
      <router-link to="/faultsWarning" tag="li" class="grid posct">
        <div>
          <div class="icon iconfont posct icon-xitongguzhang fz22 mb2"><i class="number fz12">{{faultsNumber}}</i></div>
          <div class="name ct">人工报障</div>
        </div>
      </router-link>
      <router-link to="/myEvents" tag="li" class="grid posct">
        <div>
          <div class="icon iconfont posct icon-shijiantai fz22 mb3"></div>
          <div class="name ct">告警事件</div>
        </div>
      </router-link>
      <router-link to="/maintain" tag="li" class="grid posct">
        <div>
          <div class="icon iconfont posct icon-navicon-xxwh fz22 mb5"></div>
          <div class="name ct">维护期</div>
        </div>
      </router-link>
      <router-link to="/change" tag="li" class="grid posct">
        <div>
          <div class="icon iconfont posct icon-change fz22 mb4"></div>
          <div class="name ct">变更白板</div>
        </div>
      </router-link>
    </ul>
    <router-view></router-view>
  </div>

</template>

<script>

  import {Grid, GridItem, GroupTitle} from 'vux'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {}
    },
    computed:{
      ...mapGetters([
        'servicesNumber',
        'faultsNumber',
        'eventsNumber'
      ]),
    },
    methods: {},
    components: {
      Grid,
      GridItem,
      GroupTitle
    }
  }

</script>

<style scoped>
  .grid {
    padding: 10px 0;
    width: 25%;
    float: left;
  }

  .name {
    padding-top: 5px;
  }

  .icon {
    width: 60px;
    height: 60px;
    color: #fff;
    border-radius: 50%;
    position: relative;
  }

  .number {
    font-style: normal;
    position: absolute;
    top: 0px;
    right: -3px;
    background: red;
    padding: 1px 7px;
    line-height: 18px;
    border-radius: 20px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
  }

</style>
