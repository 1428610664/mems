<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">服务请求
        <router-link to="/addRequest" tag="a" slot="right" class="iconfont icon-tianjia" @click="addRequest"></router-link>
      </x-header>
      <tab>
        <tab-item selected @on-item-click="onTabItemClick">未完成</tab-item>
        <tab-item @on-item-click="onTabItemClick">已完成</tab-item>
      </tab>
      <div class="search-box">
        <search-box @query="searchQuery" placeholder="消息搜搜"></search-box>
      </div>

      <div class="wrapper-content">

      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>

  import {XHeader} from 'vux'
  import SearchBox from 'components/search-box/search-box'
  import {Tab, TabItem} from 'vux'

  export default {
    name: "index",
    data() {
      return {
        selectIndex: 0,
      }
    },
    created() {
      setTimeout(() => {

      }, 20)
    },
    methods: {
      onTabItemClick(index) {
        this.selectIndex = index
        this.$vux.toast.text(index + "", "bottom")
      },
      searchQuery(v) {
        this.$vux.toast.text(v + "", "bottom")
      },
      addRequest(){
        this.$vux.toast.text( "添加请求", "bottom")
      },
    },
    components: {
      XHeader,
      SearchBox,
      Tab,
      TabItem,
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

  .search-box {
    padding: 5px 3%;
  }

</style>
