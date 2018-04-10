<template>

  <div class="message-wrapper">
    <tab>
      <tab-item selected @on-item-click="onTabItemClick">进行中</tab-item>
      <tab-item @on-item-click="onTabItemClick">已结束</tab-item>
    </tab>
    <div class="search-box">
      <search-box @query="searchQuery" placeholder="消息搜搜"></search-box>
    </div>

    <scroller class="list-wrapper" ref="scroll"
              :data="content"
              :totalCount="totalCount"
              :pullup="true"
              :pulldown="true"
              :listenScroll="true"
              @scrollToEnd="scrollToEnd"
              @loadingStateChange="loadingStateChange"
              @pullRefresh="pullRefresh">
      <div  v-show="LoadingState == 1" v-for="item in content" >
        <item-wrapper @onClick="onItemClick"  :row="item"></item-wrapper>
      </div>
    </scroller>
  </div>
</template>

<script>
  import SearchBox from 'components/search-box/search-box'
  import ItemWrapper from 'components/item-wrapper/item-wrapper'
  import {Tab, TabItem} from 'vux'

  import Scroller from 'components/scroll/scroller'
  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'

  export default {
    data() {
      return {
        selectIndex: 0,

        content: [],
        LoadingState: 2,
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        params: {name: ''}
      }
    },
    created() {
      setTimeout(() => {
        this.getList()
      }, 800)
    },
    methods: {
      onTabItemClick(index) {
        this.selectIndex = index
        this.$vux.toast.text(index + "", "bottom")
      },
      onItemClick(row){
        alert(JSON.stringify(row))
      },
      searchQuery(v){
        this.params.name = v
        this.getList(false, true)
      },
      pullRefresh() {
        setTimeout(() => {
          this.params.name = ''
          this.getList(true, true)
        }, 800)
      },
      getList(isUpload, pullRefresh) {
        if (pullRefresh) {
          this.pageNo = 1
          this.pageSize = 10
        }
        let param = {offset: (this.pageNo - 1) * this.pageSize,limit: this.pageSize}
        request.get(getUrl("myMessage"), Object.assign({}, this.params, param)).then(data => {
          if (data.data) {
            this.isPullLoaded = false
            this.totalCount = data.data.total
            this.content = pullRefresh ? data.data.rows : this.content.concat(data.data.rows)
          } else {
            this.$vux.toast.text("请求失败", "bottom")
          }
          this.$refs.scroll.requestSuccess(data.data, isUpload, pullRefresh, this.content, this.totalCount)
        }, error => {
          console.log("error=======" + JSON.stringify(error))
        })
      },
      scrollToEnd() {
        if (this.content.length == 0 || this.content.length >= this.totalCount || this.isPullLoaded) {
          return
        }
        this.isPullLoaded = true
        this.pageNo++
        this.getList(false)
      },
      loadingStateChange(LoadingState) {
        this.LoadingState = LoadingState
      }
    },
    components: {
      Tab,
      TabItem,
      SearchBox,
      ItemWrapper,
      Scroller
    }
  }

</script>

<style scoped>

  .message-wrapper {
    position: fixed;
    top: 46px;
    bottom: 50px;
    left: 0;
    z-index: 15;
    width: 100%;
  }

  .search-box{
    padding: 5px 3%;
  }

  .list-wrapper{
    position: absolute;
    top: 86px;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }



</style>
