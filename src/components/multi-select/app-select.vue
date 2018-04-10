<template>
  <div>
    <div class="multi_select_" @click="selectShow">
      <cell :title="title" :value="value" is-link></cell>
    </div>
    <div v-transfer-dom>
      <popup v-model="dropDown" position="bottom" max-height="50%">
        <div class="select_keyWorld" v-show="search">
          <x-input type="text" :placeholder="placeholder" v-model="params.keyWord" @on-change="onEnter"
                   @on-enter="onEnter"></x-input>
        </div>
        <div class="select_item">
          <checklist :options="rows" v-model="selectValue" :max=max @on-change="change"></checklist>
        </div>
        <div style="padding: 15px;">
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
        selectValue: [],
        params: {
          keyWord: '',
          offset: 0,
          limit: 20
        },
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
        this.value = ''
        this.getRows()
      }
    },
    methods: {
      selectShow() {
        this.dropDown = true
      },
      onEnter() {
        this.getRows()
      },
      change(val, label) {
        //console.log('change', val, label)
      },
      clickActionSheet() {
      },
      getRows() {
        request.get(this.url, Object.assign({}, this.params, this.param)).then((data) => {
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
        this.$emit('input', this.selectValue.join(","))
        this.$emit('on-ok', this.selectValue.join(","))
      }
    }
  }
</script>

<style scoped>

</style>
