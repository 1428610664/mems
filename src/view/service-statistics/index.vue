<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">服务统计</x-header>
      <tab>
        <tab-item v-for="(item, index) in tab"  :key='index' :selected="index == selectIndex" @on-item-click="onTabItemClick">{{item}}</tab-item>
      </tab>

      <div class="content-wrapper">

      </div>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Tab, TabItem} from 'vux'

  export default {
    name: "index",
    data() {
      return {
        tab: ["分类统计", "Top统计", "KPI统计"],
        selectIndex: 0
      }
    },
    computed: {
    },
    created() {
      setTimeout(() => {

      }, 20)
    },
    methods: {
      onTabItemClick(index) {
        console.log(index)
      }
    },
    components: {
      XHeader,
      Tab,
      TabItem
    }
  }
</script>

<style scoped>

  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 22;
    overflow-y: auto;
  }

  .content-wrapper{
    position: absolute;
    top: 88px;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }

</style>
