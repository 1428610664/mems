<template>
  <div>
    <div @click="checkTreeShow">
      <div>测试树形控件</div>
      <slot></slot>
    </div>
    <div v-transfer-dom>
      <popup v-model="dropDown" position="bottom" max-height="80%">
          <div class="check_keyWorld search-wrapper b " v-show="search">
            <search-box @query="searchTree" :placeholder="placeholder"></search-box>
          </div>
        <div class="check_item" :style="style">
          <v-tree ref="zTree" :data='treeData' :multiple='multiple' :halfcheck='halfcheck'/>
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
        treeData:[
          {
            "title": "核心交易系统",
          //  "nocheck":true,
          //  "clickNode": true,
            'type':'appType',
            "children": [
              {
                "title": "资管资金清算系统",
                'type':'appName',
                "children": [
                  {
                    "title": "WEB应用服务器",
                    'type':'component',
                    "children": [
                      {
                        "title": "证通",
                        'type':'colony',
                        "children": [
                          {
                            "title": "192.168.4.131",
                            'type':'ip'
                          },
                          {
                            "title": "192.168.4.132",
                            'type':'ip'
                          }
                        ]
                      },
                      {
                        "title": "default",
                        'type':'colony',
                        "children": [
                          {
                            "title": "192.168.4.132",
                            'type':'ip'
                          },
                          {
                            "title": "192.168.4.134",
                            'type':'ip'
                          }
                        ]
                      }
                    ]}]},
              {
                "title": "清算系统",
            //    "clickNode": true,
                'type':'appName',
                "children": [
                  {
                    "title": "应用服务器",
                    'type':'component',
                    "children": [
                      {
                        "title": "证通",
                        'type':'colony',
                        "children": [
                          {
                            "title": "192.168.4.135",
                            'type':'ip'
                          },
                          {
                            "title": "192.168.4.136",
                            'type':'ip'
                          }
                        ]
                      },
                      {
                        "title": "default",
                        'type':'colony',
                        "children": [
                          {
                            "title": "192.168.4.137",
                            'type':'ip'
                          },
                          {
                            "title": "192.168.4.138",
                            'type':'ip'
                          }
                        ]
                      }
                    ]}]}
            ]}
        ],
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
          console.log(JSON.stringify(res))
          this.treeData = res.children
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
        this.style.height =  window.screen.height * 0.8 -117 + "px"
        this.setCheckValue(value)
      },
      onConfirm() {
        this.dropDown = false
        console.log('getNodesRule')
        console.log(JSON.stringify(this.$refs.zTree.getNodesRule()))
        this.$emit('input', this.checkValue.join(","))
        this.$emit('on-confirm', this.checkValue.join(","), this.$refs.zTree.getNodesRule())
      }
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
