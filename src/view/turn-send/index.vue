<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">转派</x-header>
      <div class="search-box">
        <search-box @query="searchQuery" placeholder="搜索"></search-box>
      </div>
      <div class="wrapper-content">
        <div class="cell c1">
          系统运行部
        </div>
        <div class="user-wrapper">
          <checker v-model="selectUser" type="checkbox" default-item-class="list-item" selected-item-class="item-selected">
            <checker-item v-for="(item, index) in turnUser" :key="item.key" :value="item.value">{{item.value}}</checker-item>
          </checker>
        </div>
      </div>
      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Checker, CheckerItem} from 'vux'
  import SearchBox from 'components/search-box/search-box'
  import commFooter from 'components/comm-footer'

  import request from 'common/js/request'
  import {actionJson} from 'api/commonEvent'
  import {getUrl} from 'common/js/Urls'

  export default {
    name: "index",
    data() {
      return {
        turnUser: [],
        selectUser: [],
        FlowActions: [{TypeId: 1, FlowActionName: "确认"},{TypeId: 0, FlowActionName: "取消"}]}
    },
    created() {
      this._getTurnUser()
    },
    methods: {
      searchQuery(v){
        this._getTurnUser(v)
      },
      footerEvent(action){
        if(action.TypeId == 0){
          history.go(-1)
          return
        }
        let userNames = this._getSelectTurnUserName()
        if(userNames.length == 0) {
          this.$vux.toast.text("请选择转派用户", "bottom")
          return
        }
        this.$vux.loading.show({text: '数据提交中...'})
        request.post(actionJson(this.$route.query.type == "request" ? 3 : 14, this.$route.query.id)[0], {users: userNames.join(",")}).then(res => {
          this.$vux.loading.hide()
          this.$vux.toast.text(res.desc, "bottom")
          if(res.success){
            this.$router.replace({path:"/home"});
          }
        }, error => {
          this.$vux.loading.hide()
        })
      },
      _getTurnUser(keyWord){
        request.get(getUrl("turnUser"), {keyWord: keyWord, limit: 100}).then(res => {
          this.turnUser = []
          res.data.rows.forEach((v, i) => {
            this.turnUser.push({key: i, value: v.userName +"/"+ v.name})
          })
        }, error => {

        })
      },
      _getSelectTurnUserName(){
        let userName = []
        this.selectUser.forEach(( v, i) => {
          userName.push(v.split("/")[0])
        })
        return userName
      }
    },
    components: {
      XHeader,
      Checker,
      CheckerItem,

      commFooter,
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
    z-index: 60;
    overflow-y: auto;
  }

  .search-box {
    padding: 5px 3%;
  }

  .wrapper-content{
    position: absolute;
    top: 88px;
    left: 0;
    bottom: 45px;
    width: 100%;
    overflow: auto;
  }

  .user-wrapper{
    padding: 5px 10px;
  }

  .list-item {
    width: 100px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin:0 4px 4px 0;
  }
  .item-selected{
    background: #3D5C99;
    color: #fff;
    border: 1px solid #3D5C99;
  }

</style>
