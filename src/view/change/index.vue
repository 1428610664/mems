<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">变更白板
        <router-link to="/addChange" tag="a" slot="right" class="iconfont icon-tianjia"></router-link>
      </x-header>
      <tab>
        <tab-item v-for="(item, index) in tab" :key='index' :selected="index == selectIndex" @on-item-click="onTabItemClick">{{item}}</tab-item>
      </tab>
      <div class="search-box"><search-box @query="searchQuery" placeholder="搜索"></search-box></div>

      <scroller class="list-wrapper" ref="scroll"
                :data="refresh.content"
                :totalCount="refresh.totalCount"
                :pullup="true"
                :pulldown="true"
                :listenScroll="true"
                @scrollToEnd="scrollToEnd"
                @loadingStateChange="loadingStateChange"
                @pullRefresh="pullRefresh">
        <div v-show="refresh.LoadingState == 1" v-for="item in refresh.content">
          <item-wrapper @onClick="onItemClick" :row="item" :showNunber="false"></item-wrapper>
        </div>
      </scroller>

      <router-view></router-view>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Tab, TabItem} from 'vux'
  import SearchBox from 'components/search-box/search-box'
  import ItemWrapper from 'components/item-wrapper/item-wrapper2'
  import Scroller from 'components/scroll/scroller'
  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'
  import {mapMutations} from 'vuex'
  import {getUserInfo} from 'common/js/cache'


  export default {
    name: "index",
    data() {
      return {
        selectIndex: 0,
        tab: ["我的变更", "所有变更"],

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
      getTabParms() {
        let toUser = getUserInfo().toUser
        let Parms = [{createUser: getUserInfo().user.userName+(toUser ? ","+toUser: ""),sort: "createTime",order: "desc"}, {sort: "createTime",order: "desc"}]
        return Parms
      }
    },
    created() {
      setTimeout(() => {
        this.refresh.params = this.getTabParms[this.selectIndex]
        this.getList()
      }, 800)
    },
    watch: {
      '$route' (to, from) {
        if(to.path == "/change"){
          this.refresh.params.keyWord = ''
          this.getList(false, true)
        }
      }
    },
    methods: {
      ...mapMutations({
        setChange: 'SET_CHANGE'
      }),
      onTabItemClick(index) {
        this.selectIndex = index
        this.refresh.params = this.getTabParms[index]
        this.getList(false, true)
      },
      searchQuery(v) {
        this.refresh.params.keyWord = v
        this.getList(false, true)
      },
      onItemClick(row) {
        console.log(JSON.stringify(this.content[this._findIndex(row.id, this.content)]))
        this.setChange(this.content[this._findIndex(row.id, this.content)])
        this.$router.push({path: "/changeDetails",query:{id: row.id}})
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
        let param = {offset: (this.refresh.pageNo - 1) * this.refresh.pageSize, limit: this.refresh.pageSize}
        request.get(getUrl("changes"), Object.assign({}, this.refresh.params, param)).then(data => {
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
      _parseDate(res) {
        let data = []
        res.forEach((v, i) => {
          data.push({id: v.id, name: v.name, time: v.beginTime.time, status: v.status})
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
      Scroller,
      ItemWrapper
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

  .list-wrapper {
    position: absolute;
    top: 132px;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }


</style>
