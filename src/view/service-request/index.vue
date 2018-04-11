<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">服务请求
        <router-link to="/addRequest" tag="a" slot="right" class="iconfont icon-tianjia"></router-link>
      </x-header>
      <tab>
        <tab-item selected @on-item-click="onTabItemClick">未完成</tab-item>
        <tab-item @on-item-click="onTabItemClick">已完成</tab-item>
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

        content: [],
        LoadingState: 2,
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        params: {name: '', status: 0}
      }
    },
    created() {
      setTimeout(() => {
        this.getList()
      }, 800)
    },
    methods: {
      onTabItemClick(index) {
        this.params.name = ''
        this.selectIndex = index
        if(index == 0){
          this.params.status = 0
        }else{
          delete this.params.status
        }
        this.getList(false, true)
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
        let param = {offset: (this.pageNo - 1) * this.pageSize,limit: this.pageSize, isMy: true}
        request.get(getUrl("serviceRequest"), Object.assign({}, this.params, param)).then(data => {
          if (data.data) {
            this.isPullLoaded = false
            this.totalCount = data.data.total
            this.content = pullRefresh ? this._parseDate(data.data.rows) : this.content.concat(this._parseDate(data.data.rows))
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
