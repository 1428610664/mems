<template>
  <div>
    <div class="multi_select_" @click="selectShow">
      <cell :title="title" :value="value" is-link></cell>
    </div>
    <div v-transfer-dom>
      <popup v-model="dropDown" position="bottom" max-height="60%">
        <div class="select_keyWorld" v-show="search">
          <x-input type="text" :placeholder="placeholder" v-model="params.keyWord" @on-change="onEnter"
                   @on-enter="onEnter"></x-input>
        </div>
        <div class="select_item" :style="style">
          <div class="loaded ct" v-if="rows.length == 0">- 查无选项 -</div>
          <checklist :options="rows" v-model="selectValue" :max=max @on-change="change"></checklist>
        </div>
        <!--<div class="select_button">
          <x-button @click.native="onOk" plain type="primary">确认</x-button>
        </div>-->
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
        selectValue: [],
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
      url: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
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
      isFirstRequest : {
        type: Boolean,
        default: true
      },
      placeholder: {
        type: String,
        default: '输入关键字查询'
      },
      size: {
        type: String,
        default: '1'
      }
    },
    watch: {
      url(url) {
        if(this.isFirstRequest) this.getRows()
      }
    },
    mounted() {
      this.$nextTick(function () {
        if (this.url !== '') {
          if(this.isFirstRequest)this.getRows()
        }
      })
    },
    watch:{
      param(v){
        this.$emit('input', '')
        this.rows = []
        this.dateRow = []
        if(v.appType || v.appName)this.getRows()
      }
    },
    methods: {
      selectShow() {
        if(this.readonly) return
        this.dropDown = true
        this.style.height =  window.screen.height * 0.6 -117 + "px"
      },
      onEnter() {
        this.rows = []
        this.dateRow.forEach((item)=>{
          if(item.key.indexOf(this.params.keyWord) != -1){
              this.rows.push(item)
          }
        })
      },
      change(val, label) {
        this.$emit('input', this.selectValue.join(","))
      },
      clickActionSheet() {
      },
      getRows() {
        request.get(this.url, Object.assign({}, this.params, this.param)).then((data) => {
          this.params.keyWord = ''
          this.rows = []
          this.dateRow = []
          if (data.success) {
            data.data.rows.forEach((item) => {
              this.rows.push({key: item, value: item})
            })
            this.dateRow = this.rows
          }
        }, (error) => {
          console.log(JSON.stringify('error===' + error))
        })
      }
    }
  }
</script>

<style scoped>
  .select_keyWorld{height: 42px;}
  .select_button{padding:15px; height:45px; }
  .select_item{overflow: auto;background-color: #ffffff;}
</style>
