<template>
  <div>
    <div class="search-box">
      <search-box @query="searchQuery" placeholder="搜索"></search-box>
    </div>
    <div class="wrapper-content">
      <div class="cell c1">
        系统运行部
      </div>
      <div class="user-wrapper">
        <checker v-model="selectUser" type="checkbox" default-item-class="list-item"
                 selected-item-class="item-selected">
          <checker-item v-for="(item, index) in turnUser" :key="item.key" :value="item.value">{{item.value}}
          </checker-item>
        </checker>
      </div>
    </div>
    <comm-footer v-if="FlowActions" :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
  </div>
</template>

<script>

  import {XHeader, Checker, CheckerItem} from 'vux'
  import SearchBox from 'components/search-box/search-box'
  import commFooter from 'components/comm-footer'

  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'

  export default {
    name: "index",
    props: {
      placeholder: {
        type: String,
        default: '搜索'
      },
      url: {
        type: String,
        default: ''
      },
      role: {
        type: String,
        default: ''
      },
      FlowActions: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        turnUser: [],
        selectUser: []
      }
    },
    created() {
      this._getTurnUser()
    },
    methods: {
      searchQuery(v) {
        this._getTurnUser(v)
      },
      footerEvent(action) {
        if (action.TypeId == 0) {
          history.go(-1)
          return
        }
        let userNames = this._getSelectTurnUserName()
        if (userNames.length == 0) {
          this.$vux.toast.text("请选择" + action.FlowActionName + "用户", "bottom")
          return
        }
        this.$emit('actionEvent', action, userNames)
      },
      _getTurnUser(keyWord) {
        request.get(this.url ? this.url : getUrl("turnUser"), {
          keyWord: keyWord,
          limit: 100,
          role: this.role,
          queryMe: false
        }).then(res => {
          this.turnUser = []
          res.data.rows.forEach((v, i) => {
            this.turnUser.push({key: i, value: v.userName + "/" + v.name})
          })
        }, error => {

        })
      },
      _getSelectTurnUserName() {
        let userName = []
        this.selectUser.forEach((v, i) => {
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

  .search-box {
    padding: 5px 3%;
  }

  .wrapper-content {
    position: absolute;
    top: 88px;
    left: 0;
    bottom: 45px;
    width: 100%;
    overflow: auto;
  }

  .user-wrapper {
    padding: 5px 10px;
  }

  .list-item {
    min-width: 90px;
    height: 30px;
    padding: 0 5px;
    line-height: 30px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin: 0 5px 5px 0;
  }

  .item-selected {
    background: #3D5C99;
    color: #fff;
    border: 1px solid #3D5C99;
  }


</style>
