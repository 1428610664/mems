<template>

  <div>
    <ul class="grid-wrapper clear">
      <!--<router-link to="/serviceRequest" tag="li" class="grid posct">
        <div>
          <div class="icon iconfont posct icon-fuwuqingqiu fz24 mb1"><i class="number fz12" v-if="servicesNumber > 0">{{servicesNumber}}</i></div>
          <div class="name ct">服务请求</div>
        </div>
      </router-link>-->

      <router-link v-for="(item, index) in grid" :key="index" :to="item.path" tag="li" class="grid posct">
        <div>
          <div class="icon iconfont posct fz22 " :class="item.class"><i class="number fz12" v-if="item.number && item.number > 0">{{item.number}}</i></div>
          <div class="name ct">{{item.name}}</div>
        </div>
      </router-link>
    </ul>

    <router-view></router-view>

  </div>

</template>

<script>

  import {configMixin} from "common/mixin/configMixin"

  export default {
    mixins: [configMixin]
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
