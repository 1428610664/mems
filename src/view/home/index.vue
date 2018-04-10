<template>

  <div>
    <ul class="grid-wrapper clear">
      <router-link to="/serviceRequest" tag="li" class="grid posct">
        <div>
          <div class="icon iconfont posct icon-fuwuqingqiu fz24 mb1"><i class="number fz12">99+</i></div>
          <div class="name ct">服务请求</div>
        </div>
      </router-link>
      <li class="grid posct">
        <div>
          <div class="icon iconfont posct icon-xitongguzhang fz22 mb2"><i class="number fz12">5</i></div>
          <div class="name ct">人工报障</div>
        </div>
      </li>
    </ul>
    <router-view></router-view>
  </div>

</template>

<script>

  import {Grid, GridItem, GroupTitle} from 'vux'

  export default {
    data() {
      return {}
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
