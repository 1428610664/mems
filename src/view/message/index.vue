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
              :data="refresh.content"
              :totalCount="refresh.totalCount"
              :pullup="true"
              :pulldown="true"
              :listenScroll="true"
              @scrollToEnd="scrollToEnd"
              @loadingStateChange="loadingStateChange"
              @pullRefresh="pullRefresh">
      <div  v-show="refresh.LoadingState == 1" v-for="item in refresh.content" >
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

        refresh: {
          content: [],
          LoadingState: 2,
          pageNo: 1,
          pageSize: 10,
          totalCount: 0,
          params: {keyWord: ''}
        },
      }
    },
    created() {
      setTimeout(() => {
        this.getList()
      }, 800)
    },
    activated(){
      //this.$refs.scroll.refresh()
      this.getList()
      this.$refs.scroll.scrollTo( 0, 0, 200, "")
    },
    methods: {
      onTabItemClick(index) {
        if(this.selectIndex == index) return
        this.$vux.loading.show({text: '加载中...'})
        this.selectIndex = index
        this.refresh.params.keyWord = ''
        this.getList(false, true)
      },
      onItemClick(row){
        alert(JSON.stringify(row))
      },
      searchQuery(v){
        this.refresh.params.keyWord = v
        this.getList(false, true)
      },
      pullRefresh() {
        setTimeout(() => {
          this.refresh.params.keyWord = ''
          this.getList(true, true)
        }, 800)
      },
      getList(isUpload, pullRefresh) {
        if (pullRefresh) {
          this.refresh.pageNo = 1
          this.refresh.pageSize = 10
        }
        let param = {offset: (this.refresh.pageNo - 1) * this.refresh.pageSize,limit: this.refresh.pageSize, status: this.selectIndex == 0 ? 0: 99}
        request.get(getUrl("myMessage"), Object.assign({}, this.refresh.params, param)).then(data => {
          this.$vux.loading.hide()
          if (data.data) {
            this.refresh.isPullLoaded = false
            this.refresh.totalCount = data.data.total
            this.refresh.content = pullRefresh ? this._parseDate(data.data.rows) : this.refresh.content.concat(this._parseDate(data.data.rows))
          } else {
            this.$vux.toast.text("请求失败", "bottom")
          }
          this.$refs.scroll.requestSuccess(data.data, isUpload, pullRefresh, this.refresh.content, this.refresh.totalCount)
        }, error => {
          this.$vux.loading.hide()
          console.log("error=======" + JSON.stringify(error))
        })
      },
      scrollToEnd() {
        if (this.refresh.content.length == 0 || this.refresh.content.length >= this.refresh.totalCount || this.refresh.isPullLoaded) {
          return
        }
        this.refresh.isPullLoaded = true
        this.refresh.pageNo++
        this.getList(false)
      },
      loadingStateChange(LoadingState) {
        this.refresh.LoadingState = LoadingState
      },
      _parseDate(res){
        let data = []
        res.forEach((v, i) => {
          data.push({id: v.id, name: v.name, time: v.sendTime.time, counts: v.counts})
        })
        return data
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
