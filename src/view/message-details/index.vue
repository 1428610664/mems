<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">消息详情</x-header>
      <div class="search-box">
        <search-box @query="searchQuery" placeholder="消息搜索"></search-box>
      </div>

      <scroller class="content-wrapper" ref="scroll">
        <!-- && item.sendUser.split("/")[1] != getUserInfo().user.userName-->
        <div class="msg-item" v-for="(item, index) in content" v-if="LoadingState == 1" :key="index" ref="listGroup">
          <div class="user-info posct c3">
            <span>{{item.sendUser.split("/")[0]}}<br>{{item.sendUser.split("/")[1]}}</span></div>
          <div class="msg">
            <div class="msg-content" v-html="item.message"></div>
            <div class="msg-time c3 mt"><span class="iconfont icon-time fz12"></span>{{new
              Date(item.sendTime.time).format("yyyy-MM-dd hh:mm:ss")}}
            </div>
          </div>
        </div>
        <!--<div class="msg-item me-item">
          <div class="msg">
            <div class="msg-content">@肖振鹏 请把这些历史数据，和各核心生产ofasset表的BCP给一份@罗亮</div>
            <div class="msg-time c3 mt"><span class="iconfont icon-time fz12"></span> 2018-01-25 16:45</div>
          </div>
          <div class="user-info posct c3"><span>李国平<br/>06238</span></div>
        </div>-->
      </scroller>
    </div>
  </transition>
</template>

<script>

  import {XHeader} from 'vux'
  import SearchBox from 'components/search-box/search-box'
  import Scroller from 'components/scroll/scroller'

  import {getUserInfo} from 'common/js/cache'
  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'

  export default {
    name: "index",
    data() {
      return {
        content: [],

        LoadingState: 2
      }
    },
    created() {
      setTimeout(this.getMessage, 800)
    },
    methods: {
      searchQuery(v) {
        console.log(v)
      },
      getMessage() {
        request.get(getUrl("message"), {refId: this.$route.query.id, limit: 200, offset: 1}).then(res => {
          this.content = res.data.rows
          this.LoadingState = res.data.rows.length > 0 ? 1 : 4
          this.$refs.scroll.setLoadingState(res.data.rows.length > 0 ? 1 : 4)
          setTimeout(() => {
            this.$refs.scroll.refresh()
            this._scrollToBottom()
          }, 20)
        }, error => {
          this.LoadingState = 3
          this.$refs.scroll.setLoadingState(3)
        })
      },
      _scrollToBottom() {
        this.$refs.scroll.scrollToElement(this.$refs.listGroup[this.content.length - 1], 0)
      }
    },
    components: {
      XHeader,

      SearchBox,
      Scroller
    }
  }
</script>

<style >

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
    overflow: hidden;
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
    padding: 0 3px;
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

  .msg-content img {
    max-width: 100%;
  }
  .msg-content table{
    max-width: 100%;
    overflow: auto;
  }
  .msg-content table tr,.msg-content table td{
    width: 0px!important;
  }

</style>
