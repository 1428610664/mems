<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">告警事件
      </x-header>
      <tab>
        <tab-item v-for="(item, index) in tab" :key='index' :selected="index == selectIndex" @on-item-click="onTabItemClick">{{item}}</tab-item>
      </tab>
      <div class="search-box">
        <search-box @query="searchQuery" placeholder="搜索"></search-box>
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
  import {mapGetters, mapMutations} from 'vuex'
  import {getUserInfo} from 'common/js/cache'

  export default {
    name: "index",
    data() {
      return {
        selectIndex: 0,
        content: [],

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
    computed: {
      ...mapGetters([
        'userData',
      ]),
      tab(){
        let tab
        if(getUserInfo().user.role == 5){ // 服务台
          tab = ["未响应", "已响应","所有"]
        }else{
          tab = ["待处理", "已处理", "所有"]
        }
        return tab
      },
      getTabParms(){
        // status：【0：未受理】【1：处理中】【2：被驳回】【3：待评价】【4：已取消】【99：已关闭】【100：暂存】
        let Parms = []
        // 普通用户tab切换附加参数
        if(getUserInfo().user.role == 5){
          Parms = [{isMy: false,isTurn:false,processStatus:0}, {isMy: false,isTurn:false,processStatus:1}, {}]
        }else {
          Parms = [{status: '0,1',isTurn: true,isTurn:true}, {status: '99',isMy: true,isTurn:true},{}]
        }
        return Parms
      }
    },
    created() {
      setTimeout(() => {
        this.refresh.params = this.getTabParms[this.selectIndex]
        this.getList()
      }, 800)
    },
    methods: {
      ...mapMutations({
        setHandleEvents: 'SET_HANDLE_EVENTS'
      }),
      onTabItemClick(index) {
        this.refresh.params.keyWord = ''
        this.selectIndex = index
        this.refresh.params = this.getTabParms[index]
        this.getList(false, true)
      },
      onItemClick(row){
            // 暂存数据跳往添加页面 否则跳往告警详情页面
          this.setHandleEvents(this.content[this._findIndex(row.id, this.content)])
          this.$router.push({path: "/handleEvents",query:{id: row.id}})

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
        let param = {offset: (this.refresh.pageNo - 1) * this.refresh.pageSize,limit: this.refresh.pageSize}
        request.get(getUrl("events"), Object.assign({}, this.refresh.params, param)).then(data => {
          if (data.data) {
            this.refresh.isPullLoaded = false
            this.refresh.totalCount = data.data.total
            this.content = pullRefresh ? data.data.rows : this.content.concat(data.data.rows)
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
      },
      _findIndex(id, data){
        return data.findIndex((item) => {
          return item.id == id
        })
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
