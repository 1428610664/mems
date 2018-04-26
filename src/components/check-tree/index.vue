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
          <!--<x-button @click.native="setValue" plain type="primary">设置选中值</x-button>-->
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import {XInput, Cell, Checklist, Actionsheet, TransferDom, Popup, XButton} from 'vux'

  import SearchBox from 'components/search-box/search-box'
  import request from 'common/js/request'

  export default {
    data() {
      return {
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
        // request.get("url", Object.assign({})).then((data) => {
        //   this.rows = []
        //   if (data.success) {
        //    // this.treeData = data.data.rows
        //     this.$nextTick(function () {
        //       this.$refs.zTree.setAppTypeChecked(this.value)
        //     })
        //   }
        // }, (error) => {
        //   console.log(JSON.stringify('error===' + error))
        // })
      },
      onConfirm() {
        this.dropDown = false
        console.log('getNodesRule')
        console.log(JSON.stringify(this.$refs.zTree.getNodesRule()))
        this.$emit('input', this.checkValue.join(","))
        this.$emit('on-confirm', this.checkValue.join(","))
      },
      // setValue() {
      //  let aa =[{"appName":"资管资金清算系统","appType":"核心交易系统","objName":"WEB应用服务器","clu":{"default":"192.168.4.132"},"ips":"192.168.4.132","opt":"包含"},{"appName":"清算系统","appType":"核心交易系统","objName":"应用服务器","clu":{"证通":"192.168.4.135"},"ips":"192.168.4.135","opt":"包含"}]
      //   this.$refs.zTree.setAppTypeChecked(aa)
      // }
    }
  }
</script>

<style scoped>
  .check_button{padding:15px; height:45px; }
  .check_item{overflow: auto;background-color: #ffffff;}

  .search-wrapper {
    padding: 5px 3%;
  }
</style>
