<template>
  <div>
    <div class="multi_select_" @click="selectShow">
      <cell :title="title" :value="typeof value == 'string' ? value : value.join(',')" is-link></cell>
    </div>
    <div v-transfer-dom>
      <popup v-model="dropDown" position="bottom" max-height="60%">
        <div class="search-wrapper b" v-show="search">
          <search-box @query="searchQuery" placeholder="搜索"></search-box>
        </div>

        <div class="select_item" :style="style">
          <div class="loaded ct" v-if="rows.length == 0">- 查无选项 -</div>

          <checker v-model="selectValue" :type="multi ? 'checkbox' : 'radio'" default-item-class="list-item" @on-change="onChange"
                   selected-item-class="item-selected">
            <checker-item v-for="(item, index) in rows" :key="item.key" :value="item.value">{{item.value}}
            </checker-item>
          </checker>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import {Cell, Actionsheet, TransferDom, Popup, Checker, CheckerItem} from 'vux'
  import request from 'common/js/request'

  import SearchBox from 'components/search-box/search-box'

  export default {
    data() {
      return {
        rows: [],
        selectValue: this.value,
        params: {
          keyWord: '',
          offset: 0,
          limit: 20
        },
        style:{
          height: 'inherit'
        },
        dateRow:[],
        max: +this.size,
        dropDown: false,

      }
    },

    directives: {
      TransferDom
    },
    props: {
      url: {
        type: String,
        default: ''
      },
      value: '',
      param: '',
      title: {
        type: String,
        default: ''
      },
      search: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '输入关键字查询'
      },
      // 是否多选
      multi: {
        type: Boolean,
        default: true
      }
    },
    watch:{
      param(v){
        this.$emit('input', '')
        this.rows = []
        this.dateRow = []
        if(v.appType || v.appName)this.getRows()
      }
    },
    created(){
      setTimeout(this.getRows, 20)
    },
    methods: {
      searchQuery(v){
        this.params.keyWord = v
        this.getRows()
      },
      onChange(v){
        this.$emit('input', this.multi ? this.selectValue.join(",") : this.selectValue)
      },
      selectShow() {
        if(this.readonly) return
        this.dropDown = true
        this.style.height =  window.screen.height * 0.6 -117 + "px"
      },
      getRows() {
        request.get(this.url, Object.assign({}, this.params, this.param)).then((data) => {
          this.params.keyWord = ''
          this.rows = []
          this.dateRow = []
          if (data.success) {
            data.data.rows.forEach((item) => {
              this.rows.push({key: item.userName, value: item.userName +"/"+ item.name})
            })
            this.dateRow = this.rows
          }
        }, (error) => {
          console.log(JSON.stringify('error===' + error))
        })
      }
    },
    components: {
      Cell,
      Actionsheet,
      Popup,
      Checker,
      CheckerItem,

      SearchBox
    }
  }
</script>

<style scoped>
  .select_keyWorld{height: 42px;}
  .select_button{padding:15px; height:45px; }
  .select_item{overflow: auto;background-color: #ffffff;padding: 5px 8px;}

  .search-wrapper {
    padding: 5px 3%;
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
