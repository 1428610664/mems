<template>
  <div>
    <!--<div @click="checkTreeShow">
      <div>测试树形控件</div>
      <slot></slot>
    </div>-->
    <div v-transfer-dom>
      <popup v-model="dropDown" position="bottom" max-height="80%">
          <div class="check_keyWorld search-wrapper b " v-show="search" @click="setDetails">
            <search-box @query="searchTree" :placeholder="placeholder"></search-box>
          </div>
        <div class="checked_value">
          <div>已选组件{{checkValue.length}}项<a href="javascript:void(0)" @click="loookDetails">{{details ? "隐藏" : "查看"}}已选详情</a></div>
          <!--SysAppUtils.getTreeDate(rule.app)-->
        </div>
        <div class="check_item" :style="style">
          <div v-show="details">
            <v-tree ref="tree2" :tpl='tpl' :data='newCheckedVal'/>
          </div>
          <div v-show="!details">
            <v-tree ref="zTree" :data='treeData' :multiple='multiple' :halfcheck='halfcheck' @node-click="nodeClick" />
          </div>
        </div>
        <div class="check_page" v-show="!details">
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
  import SysAppUtils from 'common/js/SysAppUtils'
  import SearchBox from 'components/search-box/search-box'
  import iPage from 'components/page/index'

  export default {
    data() {
      return {
        index: 0, // 记录索引
        rows: [],
        details:false,
        checkValue: [],
        treeData:[{ title: 'root', expanded: true, children: [] }],   // 树显示数据
        treeAllData: {},    // 一次性加载全部数据
        style:{
          height: 'inherit'
        },
        newCheckedVal:[],
        pageNumber:1,
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
        this.keyWord = val
        this.getTreeData()
      },
      getTreeData(page) {
        request.get(getUrl("findTree"), {keyWord:this.keyWord ? this.keyWord :'',offset:(+this.pageNumber-1)*100 ,limit:100}).then(res => {
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
        this.checkValue = value ? value:[]
        this.index = index
        this.dropDown = true
        this.style.height =  window.screen.height * 0.8 -207 + "px"
        this.getTreeData()
      },
      onConfirm() {
        this.dropDown = false
        //this.$emit('input', this.checkValue.join(","))
        this.$emit('on-confirm', this.checkValue, this.index)
      },
      /**
       * 初始化tree
       */
      initTreeData(){
        let appType = []
        const row = JSON.parse(this.treeAllData.rows).children
        row.forEach((item) =>{
          if(item.children && item.children.length > 0 ){
            appType.push({title: item.title, type:item.type,expanded:true,children: this.getChildrenData(item.children)})
          }else {
            appType.push({title: item.title,expanded:true, type:item.type})
          }
        })
        this.treeData[0].children = appType
        this.$nextTick(()=>{
          this.$refs.zTree.setAppTypeChecked(this.checkValue)
        })
      },
      getChildrenData (children) {
        let appType = []
        children.forEach((item)=> {
          if(item.children && item.children.length > 0 ){
            if(item.type == 'component'){
              appType.push({title: item.title,expanded:true, type:item.type,children:this._parseIp(item.children)})
            }else {
              appType.push({title: item.title,expanded:true, type:item.type,children:this.getChildrenData(item.children)})
            }
          }else {
            appType.push({title: item.title,expanded:true, type:item.type})
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
        this.pageNumber = page
        this.getTreeData(page)
      },
      getCheckedValue (val,newVal) {
        let _newVal = newVal
        let _arr = []
        val.forEach((item)=>{
           let theSame = false
          newVal.forEach((v,index)=>{
               if(v.appType == item.appType && v.appName == item.appName && v.objName == item.objName ){
                   theSame = true
                   _newVal.splice(index,1)
                   if( (v.appName =='' && item.appName == '')|| (v.objName =='' && item.objName == '') ||(v.ips =='' && item.ips == '')   ){
                     _arr.push(item)
                   }else{
                      _arr.push(this.getClu(item,v))
                   }
               }
           })
          if(!theSame){
            _arr.push(item)
          }
        })
        _arr = _arr.concat(_newVal)
        return _arr
      },
      getClu (oldItem,newItem){
        let _old_clu = oldItem.clu
        let _old_ips = oldItem.ips.split(',')
        let _new_clu = newItem.clu
        let _new_ips = newItem.ips.split(',')
        _old_ips.forEach((ip)=>{
          if(_new_ips.indexOf(ip) == -1){
            _new_ips.push(ip)
          }
        })
        for(let key in _old_clu){
           if(_new_clu[key] && _new_clu[key] != ''){
              let _arr = _old_clu[key].split(",")
             _arr.forEach((ip)=>{
                if(_new_clu[key].indexOf(ip) == -1){
                   _new_clu[key] = _new_clu[key] + ',' + ip
                 }
             })
           }else {
             _new_clu[key] = _old_clu[key]
           }
        }
        newItem.clu = _new_clu
        newItem.ips = _new_ips.join(',')
        return newItem
      },
      loookDetails(){
        this.details = !this.details
      },
      tpl (node, ctx) {
        if(node.parent && node.parent!= null){
          return <span>
      <span className='node-title' domPropsInnerHTML={node.title} onClick={() => {ctx.parent.nodeSelected(ctx.props.node)}}></span>
      <button style='color:red;margin-left:5px; padding:0 5px;'
              onClick={() => {
               // this.$refs.tree2.delNode(node.parent, node)
                this.checkValue = this.deleteCheckValue(node)
                this.$refs.zTree.setAppTypeChecked(this.checkValue)
                this.newCheckedVal = SysAppUtils.getTreeDate(this.checkValue)
              }}>删除</button>
      </span>
        }else {
          return <span>
         <span className='node-title' domPropsInnerHTML={node.title} onClick={() => {ctx.parent.nodeSelected(ctx.props.node)}}></span>
      </span>
        }
      },
      deleteCheckValue(node){
        let _arr = []
        this.checkValue.forEach((item)=>{
           switch (node.type) {
             case 'ip':
               if(node.parent.parent.title == item.objName && node.parent.parent.parent.title == item.appName){
                 let _ipsNew = []
                 let _ipNew = []
                 let _ips = item.ips.split(',')
                 let _ip = item.clu[node.parent.title].split(',')
                 delete item.clu[node.parent.title]
                 _ips.forEach((ip)=>{
                   if(node.title != ip){
                     _ipsNew.push(ip)
                     }
                  })
                 _ip.forEach((ip)=>{
                   if(node.title != ip){
                     _ipNew.push(ip)
                   }
                 })
                 item.clu[node.parent.title] = _ipNew.join(',')
                 item.ips = _ipsNew.join(',')
                 _ipsNew =null
                 _ipNew =null
                 _ips =null
                 _ip =null
                 if(item.ips != '' && item.ips.length) _arr.push(item)
               }else {
                 _arr.push(item)
               }
               break;
             case 'colony':
               if(node.parent.title == item.objName && node.parent.parent.title == item.appName){
                  let _ipsNew = []
                  let _ipsClu = item.clu[node.title]
                  let _ips = item.ips.split(',')
                  delete item.clu[node.title]
                   _ips.forEach((ip)=>{
                       if(_ipsClu.indexOf(ip) ==-1){
                         _ipsNew.push(ip)
                       }
                    })
                    item.ips = _ipsNew.join(',')
                    _ipsNew =null
                    _ipsClu =null
                    _ips =null
                 if(item.ips != '' && item.ips.length) _arr.push(item)
               }else {
                  _arr.push(item)
               }

               break;
             case 'component':
               if(node.title == item.objName && node.parent.title == item.appName){

               }else {
                 _arr.push(item)
               }
               break;
             default:
           }
        })
        return _arr
      },
      nodeClick(node){
        if(node.checked){
          this.checkValue =  this.getCheckedValue(this.checkValue, this.$refs.zTree.getNodesRule())
        }else {
          this.checkValue =  this.deleteCheckValue(node)
        }
        this.newCheckedVal = SysAppUtils.getTreeDate(this.checkValue)
        this.details =false
        console.log(node,this.checkValue)
      },
      setDetails () {
        this.details =false
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
  .checked_value{max-height: 335px; text-align: center;line-height: 30px;}
  .checked_value a{margin-left: 20px}
  .search-wrapper {padding: 5px 3%;}
</style>
