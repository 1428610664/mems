<template>
  <div>
    <!--<div @click="checkTreeShow">
      <div>测试树形控件</div>
      <slot></slot>
    </div>-->
    <div v-transfer-dom>
      <popup v-model="dropDown" position="bottom" max-height="80%">
          <div class="check_keyWorld search-wrapper b " v-show="search">
            <search-box @query="searchTree" :placeholder="placeholder"></search-box>
          </div>
        <div class="check_item" :style="style">
          <v-tree ref="zTree" :data='treeData' :multiple='multiple' :halfcheck='halfcheck'/>
        </div>
        <div class="check_page">
          <i-page :total = 'treeAllData.total' limit="100" @change="pageChange"></i-page>
        </div>
        <div class="check_button">
          <x-button @click.native="onConfirm" plain type="primary">确认</x-button>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>

  import {XInput, Cell, Checklist, Actionsheet, TransferDom, Popup, XButton} from 'vux'
  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'
  import SearchBox from 'components/search-box/search-box'
  import iPage from 'components/page/index'

  export default {
    data() {
      return {
        index: 0, // 记录索引
        rows: [],
        checkValue: [],
        treeData:[{ title: 'root', expanded: true, children: [] }],   // 树显示数据
        treeAllData: {},    // 一次性加载全部数据
        style:{
          height: 'inherit'
        },
        keyWord:'',
        dropDown: false
      }
    },
    props: {
      value:[],
      search: {
        type: Boolean,
        default: false
      },
      isFirstRequest : {
        type: Boolean,
        default: true
      },
      placeholder: {
        type: String,
        default: '输入关键字查询'
      },
      multiple:{
        type: Boolean,
        default: true
      },
      halfcheck:{
        type: Boolean,
        default: false
      }
    },
    watch: {
      value(val){
        this.$refs.zTree.setAppTypeChecked(val)
      }
    },
    mounted() {
      this.$nextTick(function () {
        if(this.isFirstRequest)this.getTreeData()
      })
    },
    methods: {
      searchTree(val) {
          //this.$refs.zTree.searchNodes(val)
        this.keyWord = val
        this.getTreeData()
      },
      getTreeData(page) {
        request.get(getUrl("findTree"), {keyWord:this.keyWord ? this.keyWord :'',offset:page  ? (+page-1)*100: 0 ,limit:100}).then(res => {
          this.treeAllData = res.data
          this.initTreeData()
        }, error =>{
          console.log('error===' + error)
        })
      },
      setCheckValue(v){
        if(v)this.$refs.zTree.setAppTypeChecked(v)
      },
      showTreeModel(index, value){
        this.index = index
        this.dropDown = true
        this.style.height =  window.screen.height * 0.8 -177 + "px"
        this.getTreeData()
      },
      onConfirm() {
        this.dropDown = false
        //this.$emit('input', this.checkValue.join(","))
        this.$emit('on-confirm', this.$refs.zTree.getNodesRule(), this.index)
      },

      /**
       * 初始化tree
       */
      initTreeData(){
        let appType = []
        const row = JSON.parse(this.treeAllData.rows).children
        console.log(row)
        row.forEach((item) =>{
          if(item.children && item.children.length > 0 ){
            appType.push({title: item.title, type:item.type,children: this.getChildrenData(item.children)})
          }else {
            appType.push({title: item.title, type:item.type})
          }
        })
        this.treeData[0].children = appType
      },
      getChildrenData (children) {
        let appType = []
        children.forEach((item)=> {
          if(item.children && item.children.length > 0 ){
            if(item.type == 'component'){
              appType.push({title: item.title, type:item.type,children:this._parseIp(item.children)})
            }else {
              appType.push({title: item.title, type:item.type,children:this.getChildrenData(item.children)})
            }
          }else {
            appType.push({title: item.title, type:item.type})
          }
        })
        return appType
      },
      /*
        解析组件下的服务器ip
      */
      _parseIp(data){
        let node = [], clusters = []
        for(let item of data){
          let cluIndex = clusters.indexOf(item.cluster)
          if(cluIndex != -1){
            node[cluIndex].children.push({title: item.title, type:'ip'})
          }else{
            node.push({title: item.cluster, type:'colony', children: [{title: item.title, type:'ip'}]})
            clusters.push(item.cluster)
          }
        }
        return node
      },
      /**
       * 获取索引
       * @param title
       * @param data
       * @returns {number | *}
       * @private
       */
      _findIndex(title, data){
        return data.findIndex((item) => {
          return item.title == title
        })
      },
      pageChange(page){
        this.getTreeData(page)
      }
    },
    components: {
      SearchBox,
      iPage,

      XInput,
      Checklist,
      Cell,
      Actionsheet,
      Popup,
      XButton
    },
    directives: {
      TransferDom
    },
  }
</script>

<style scoped>
  .check_button{padding:15px; height:45px; }
  .check_item{overflow: auto;background-color: #ffffff;}
  .check_page{max-height: 60px;}
  .search-wrapper {padding: 5px 3%;}
</style>
