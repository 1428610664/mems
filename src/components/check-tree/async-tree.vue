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
          <v-tree ref="zTree" :data='treeData' :multiple='multiple' :halfcheck='halfcheck'  @async-load-nodes='asyncLoadNodes'/>
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

  export default {
    data() {
      return {
        index: 0, // 记录索引
        rows: [],
        checkValue: [],
        treeData:[{ title: 'root', expanded: true, children: [] }],   // 树显示数据
        treeAllData: [],    // 一次性加载全部数据
        style:{
          height: 'inherit'
        },
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
      checkTreeShow() {
        this.dropDown = true
        this.style.height =  window.screen.height * 0.8 -117 + "px"
      },
      searchTree(val) {
          this.$refs.zTree.searchNodes(val)
      },
      getTreeData() {
        request.get(getUrl("findTree"), {}).then(res => {
          this.treeAllData = res.data.rows.children
          this.initTreeDta()
        }, error =>{
          console.log('error===' + error)
        })
      },
      /*setCheckValue(v){
        if(v)this.$refs.zTree.setAppTypeChecked(v)
      },*/
      showTreeModel(index, value){
        this.index = async
        this.dropDown = true
        this.style.height =  window.screen.height * 0.8 -117 + "px"
        //this.checkValue = value
        this._setTreeAppType()
      },
      onConfirm() {
        this.dropDown = false
        //this.$emit('input', this.checkValue.join(","))
        this.$emit('on-confirm', this.$refs.zTree.getNodesRule(), this.index)
      },

      async asyncLoadNodes(node){
        let titles = this._getParentsTitles(node)
        let children = this._getCurrentNodeChildren(titles)
        this._setTreeNode(node, children)
      },
      /**
       * 初始化tree
       */
      initTreeDta(sellectTree){
        this._setTreeAppType()
      },
      _setTreeAppType(selectNode){
        let appType = []
        for(let i = 0, ilen = this.treeAllData.length; i< ilen; i++){
          appType.push({title: this.treeAllData[i].title, type: this.treeAllData[i].type, async: true})
        }
        this.treeData[0].children = appType
      },
      /**
       * 为节点设置children数据
       * @param node
       * @param children
       * @returns {*[]}
       * @private
       */
      _setTreeNode(node, children){
        children.forEach((el, i) => {
          if (!node.hasOwnProperty('children')) {
            this.$set(node, 'children', [])
          }
          node.children.push({title: el.title, type: el.type, async: el.children ? true : false})
        })
      },
      /**
       * 获取节点的title及所有父级title
        * @param node
       * @returns {*[]}
       * @private
       */
      _getParentsTitles(node){
        let titleArr = []
        function findeParen(n){
          if(n.parent){
            titleArr.push(n.title)
            findeParen(n.parent)
          }
        }
        findeParen(node)
        return titleArr.reverse()
      },
      /**
       * 根据title获取当前节点下的Children数据
       * @param titles
       * @returns {Array}
       * @private
       */
      _getCurrentNodeChildren(titles){
        let treeData = this.treeAllData
        for(let item of titles){
          let index = this._findIndex(item, treeData)
          if(treeData[async].children && treeData[async].children.length > 0 && treeData[async].children[0].cluster) {
            treeData = this._parseIp(treeData[async].children)
          }else{
            treeData = treeData[async].children
          }
        }
        return treeData
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
    },
    components: {
      SearchBox,

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

  .search-wrapper {
    padding: 5px 3%;
  }
</style>
