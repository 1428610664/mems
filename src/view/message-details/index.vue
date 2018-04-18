<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">消息详情</x-header>
      <div class="search-box">
        <search-box @query="searchQuery" placeholder="消息搜索"></search-box>
      </div>

      <scroller class="content-wrapper" :data="content" :class="$route.query.status == 99 ? 'pos-b' : ''" ref="scroll">

        <div class="msg-item" :class="_isMeMsg(item) ? 'me-item': ''" v-for="(item, index) in content" v-if="LoadingState == 1" :key="index" ref="listGroup">
          <template v-if="!_isMeMsg(item)">
            <div class="user-info posct c3"><span>{{item.sendUser.split("/")[0]}}<br>{{item.sendUser.split("/")[1]}}</span></div>
            <div class="msg">
              <div class="msg-content" v-html="item.message"></div>
              <div class="msg-time c3 mt"><span class="iconfont icon-time fz12"></span> {{new Date(item.sendTime.time).format("yyyy-MM-dd hh:mm:ss")}}</div>
            </div>
          </template>

          <template v-if="_isMeMsg(item)">
            <div class="msg">
              <div style="text-align: right;"><div class="msg-content" v-html="item.message"></div></div>
              <div class="msg-time c3 mt"><span class="iconfont icon-time fz12"></span> {{new Date(item.sendTime.time).format("yyyy-MM-dd hh:mm:ss")}}</div>
            </div>
            <div class="user-info posct c3">
              <span>{{item.sendUser.split("/")[0]}}<br>{{item.sendUser.split("/")[1]}}</span></div>
          </template>
        </div>
      </scroller>
      <div class="send-wrapper" v-if="$route.query.status != 99">
      <send-msg @send="sendMsg" ref="messageWrapper"></send-msg>
      </div>
    </div>
  </transition>
</template>

<script>

  import {XHeader} from 'vux'
  import SearchBox from 'components/search-box/search-box'
  import Scroller from 'components/scroll/scroller'
  import SendMsg from 'components/send-msg/send-msg'

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
        this.getMessage(v)
      },
      getMessage(keyWord) {
        request.get(getUrl("message"), {refId: this.$route.query.id, limit: 200, offset: 1,keyWord: keyWord}).then(res => {
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
      sendMsg(msg){
        request.post(getUrl("message"), {refId: this.$route.query.id, type: this.$route.query.type, message: msg}).then(res => {
          console.log("========="+JSON.stringify(res))
          if (res.success) {
            // 发送成功立即请求消息列表
            this.getMessage()
            this.$refs.messageWrapper.clearMsg()
          } else {
            this.$vux.toast.text("发送失败", "bottom")
          }
        }, error => {
          this.$vux.toast.text("发送失败", "bottom")
        })
      },
      _scrollToBottom() {
        this.$refs.scroll.scrollToElement(this.$refs.listGroup[this.content.length - 1], 0)
      },
      _isMeMsg(item){
        return item.sendUser.split("/")[1] == getUserInfo().user.userName
      }
    },
    components: {
      XHeader,

      SearchBox,
      SendMsg,
      Scroller
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
    bottom: 50px;
    overflow: hidden;
    width: 100%;
  }
  .content-wrapper.pos-b{
    bottom: 0px!important;
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

  .me-item .msg-content{
    background: #eee;
    color: #5e5e5e;
  }

  .send-wrapper{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 22;
    width: 100%;
    height: 50px;
  }

  .send-wrapper:before{
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background: #3D5C99;
    -webkit-transform: scaleY(.4);
    transform: scaleY(.4);
  }

</style>
