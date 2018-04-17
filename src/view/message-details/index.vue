<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">消息详情</x-header>
      <div class="search-box">
        <search-box @query="searchQuery" placeholder="消息搜索"></search-box>
      </div>

      <div class="content-wrapper">
        <div class="msg-item">
          <div class="user-info posct c3"><span>李国平<br/>06238</span></div>
          <div class="msg">
            <div class="msg-content">@肖振鹏 请把这些历史数据，和各核心生产ofasset表的BCP给一份@罗亮</div>
            <div class="msg-time c3 mt"><span class="iconfont icon-time fz12"></span> 2018-01-25 16:45</div>
          </div>
        </div>
        <div class="msg-item me-item">
          <div class="msg">
            <div class="msg-content">@肖振鹏 请把这些历史数据，和各核心生产ofasset表的BCP给一份@罗亮</div>
            <div class="msg-time c3 mt"><span class="iconfont icon-time fz12"></span> 2018-01-25 16:45</div>
          </div>
          <div class="user-info posct c3"><span>李国平<br/>06238</span></div>
        </div>
        <div class="msg-item me-item">
          <div class="msg">
            <div class="msg-content">@肖振鹏 请把这些</div>
            <div class="msg-time c3 mt"><span class="iconfont icon-time fz12"></span> 2018-01-25 16:45</div>
          </div>
          <div class="user-info posct c3"><span>李国平<br/>06238</span></div>
        </div>
        <div class="msg-item me-item">
          <div class="msg">
            <div class="msg-content">@肖振鹏 请把这些历史数据，和各核心生产ofasset表的BCP给一份@罗亮</div>
            <div class="msg-time c3 mt"><span class="iconfont icon-time fz12"></span> 2018-01-25 16:45</div>
          </div>
          <div class="user-info posct c3"><span>李国平<br/>06238</span></div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>

  import {XHeader} from 'vux'
  import SearchBox from 'components/search-box/search-box'
  import {getUserInfo} from 'common/js/cache'
  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'

  export default {
    name: "index",
    data() {
      return {}
    },
    created() {

    },
    methods: {
      searchQuery(v) {
        console.log(v)
      }
    },
    components: {
      XHeader,

      SearchBox
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

  .content-wrapper {
    position: absolute;
    top: 88px;
    bottom: 45px;
    overflow: auto;
    width: 100%;
  }

  .msg-item {
    width: 100%;
    margin: 10px 0;
    display: flex;
    justify-content: flex-start;
  }

  .msg-item.me-item {
    justify-content: flex-end;
  }

  .user-info {
    width: 60px;
    height: 50px;
  }

  .msg {
    display: inline-block;
    max-width: 75%;
  }

  .msg-content {
    padding: 10px;
    display: inline-block;
    background: #00bcd4;
    border-radius: 5px;
    color: #fff;
  }
</style>
