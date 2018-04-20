<template>
  <div>
    <div @click="checkTreeShow">
       <div>测试树形控件</div>
       <slot></slot>
    </div>
    <div v-transfer-dom>
      <popup v-model="dropDown" position="bottom" max-height="80%">
        <div class="check_keyWorld" v-show="search">
          <x-input type="text" :placeholder="placeholder" v-model="params.keyWord" @on-change="onEnter"
                   @on-enter="onEnter"></x-input>
        </div>
        <div class="check_item" :style="style">
          <v-tree ref="zTree" :data='treeData2' :multiple='multiple' :halfcheck='halfcheck'/>
        </div>
        <div class="check_button">
          <x-button @click.native="onOk" plain type="primary">确认</x-button>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import {XInput, Cell, Checklist, Actionsheet, TransferDom, Popup, XButton} from 'vux'
  import request from 'common/js/request'

  export default {
    data() {
      return {
        rows: [],
        checkValue: [],
        params: {
          keyWord: '',
          offset: 0,
          limit: 20
        },
        treeData2:[
          {
            "title": "核心交易系统",
            "children": [
              {
                "title": "资管资金清算系统",
                "clickNode": true,
                "children": [
                  {
                    "title": "WEB应用服务器",
                    "children": [
                      {
                        "title": "证通",
                        "children": [
                          {
                            "title": "192.168.4.135"
                          },
                          {
                            "title": "192.168.4.136"
                          }
                        ]
                      },
                      {
                        "title": "default",
                        "children": [
                          {
                            "title": "192.168.4.135"
                          },
                          {
                            "title": "192.168.4.136"
                          }
                        ]
                      }
                      ]}]}]}]
                        ,
        style:{
          height: 'inherit'
        },
        dropDown: false
      }
    },
    components: {
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
      value:'',
      param: '',
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

      }
    },
    mounted() {
      this.$nextTick(function () {
          if(this.isFirstRequest)this.getRows()
      })
    },
    methods: {
      checkTreeShow() {
        this.dropDown = true
        this.style.height =  window.screen.height * 0.8 -117 + "px"
      },
      onEnter() {
        this.rows = []
      },
      clickActionSheet() {
      },
      getRows() {
        request.get("url", Object.assign({}, this.params, this.param)).then((data) => {
          this.params.keyWord = ''
          this.rows = []
          if (data.success) {
            data.data.rows.forEach((item) => {
              this.rows.push({key: item, value: item})
            })
          }
        }, (error) => {
          console.log(JSON.stringify('error===' + error))
        })
      },
      onOk() {
        this.dropDown = false
        console.log('getSelectedNodes')
        console.log(this.$refs.zTree.getSelectedNodes(true))
        console.log('getCheckedNodes')
        console.log(this.$refs.zTree.getCheckedNodes(true))
        console.log('getNewNodes')
        console.log(this.$refs.zTree.getNewNodes({selected:true}))
        this.$emit('input', this.checkValue.join(","))
        this.$emit('on-ok', this.checkValue.join(","))
      }
    }
  }
</script>

<style scoped>
  .check_keyWorld{height: 42px;}
  .check_button{padding:15px; height:45px; }
  .check_item{overflow: auto;background-color: #ffffff;}
  .halo-tree{font-size: 12px !important;}
</style>
