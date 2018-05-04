<template>
  <div>
    <div class="search-user">
      <search-box @query="searchQuery" placeholder="搜索"></search-box>
    </div>
    <div class="user-content">
      <div class="user-wrapper">
        <checker radio-required  default-item-class="list-item"
                 selected-item-class="item-selected">
          <checker-item v-for="(item, index) in turnUser" :key="item.key" :value="item.value" @on-item-click="change">{{item.value}}
          </checker-item>
        </checker>
      </div>
    </div>
  </div>
</template>

<script>

  import {Checker, CheckerItem} from 'vux'
  import SearchBox from 'components/search-box/search-box'

  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'

  export default {
    name: "index",
    props: {
      placeholder: {
        type: String,
        default: '搜索'
      }
    },
    data() {
      return {
        turnUser: [],
      }
    },
    created() {
      this._getTurnUser()
    },
    methods: {
      searchQuery(v) {
        this._getTurnUser(v)
      },
      _getTurnUser(keyWord) {
        request.get(getUrl("users"), {
          keyWord: keyWord,
          limit: 100,
          queryMe: false
        }).then(res => {
          this.turnUser = []
          res.data.rows.forEach((v, i) => {
            this.turnUser.push({key: i, value: v.userName + "/" + v.name})
          })
        }, error => {

        })
      },
      change (val) {
        let _obj = { name:val.split('/')[1],key:val.split('/')[0]}
        this.$emit('change', _obj)
      }
    },
    components: {
      Checker,
      CheckerItem,

      SearchBox
    }
  }
</script>

<style scoped>
  .search-user{padding: 2px 3%;}
  .search-box {height: 25px!important;}

  .user-content {
    max-height: 65px;
    width: 100%;
    overflow: auto;
  }

  .user-wrapper {
    padding: 5px 10px;
  }

  .list-item {
    min-width: 90px;
    height: 25px;
    padding: 0 5px;
    font-size: 12px;
    line-height: 25px;
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
