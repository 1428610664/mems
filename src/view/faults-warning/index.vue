<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">人工报障
        <router-link to="/addWarning" tag="a" slot="right" class="iconfont icon-tianjia"></router-link>
      </x-header>
      <tab>
        <tab-item selected @on-item-click="onTabItemClick">未完成</tab-item>
        <tab-item @on-item-click="onTabItemClick">已完成</tab-item>
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
          <item-wrapper @onClick="onItemClick"  :row="item" :showNunber="false"></item-wrapper>
        </div>
      </scroller>

      <router-view></router-view>
    </div>
  </transition>
</template>

<script>

  import SearchBox from 'components/search-box/search-box'
  import {XHeader, Tab, TabItem} from 'vux'

  import ItemWrapper from 'components/item-wrapper/item-wrapper'
  import Scroller from 'components/scroll/scroller'
  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'

  export default {
    name: "index",
    data() {
      return {
        selectIndex: 0,

        refresh: {
          content: [],
          LoadingState: 2,
          pageNo: 1,
          pageSize: 10,
          totalCount: 0,
          params: {keyWord: '', status: 0}
        },
      }
    },
    created() {
      setTimeout(() => {
        this.getList()
      }, 800)
    },
    methods: {
      onTabItemClick(index) {
        this.refresh.params.keyWord = ''
        this.selectIndex = index
        if(index == 0){
          this.refresh.params.status = 0
        }else{
          delete this.refresh.params.status
        }
        this.getList(false, true)
        this.$vux.toast.text(index + "", "bottom")
      },
      onItemClick(row){
        this.$router.push({path: '/handleWarning',query:{id: row.id}})
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
        let param = {offset: (this.refresh.pageNo - 1) * this.refresh.pageSize,limit: this.refresh.pageSize, isMy: true}
        request.get(getUrl("faultsWarning"), Object.assign({}, this.refresh.params, param)).then(data => {
          if (data.data) {
            this.refresh.isPullLoaded = false
            this.refresh.totalCount = data.data.total
            this.refresh.content = pullRefresh ? this._parseDate(data.data.rows) : this.refresh.content.concat(this._parseDate(data.data.rows))
          } else {
            this.$vux.toast.text("请求失败", "bottom")
          }
          this.$refs.scroll.requestSuccess(data.data, isUpload, pullRefresh, this.refresh.content, this.refresh.totalCount)
        }, error => {
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
          data.push({id: v.id, name: v.name, time: v.createTime.time, status: v.status})
        })
        return data
      }
    },
    components: {
      XHeader,
      Tab,
      TabItem,
      SearchBox,
      ItemWrapper,
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

  .list-wrapper{
    position: absolute;
    top: 132px;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }

</style>
