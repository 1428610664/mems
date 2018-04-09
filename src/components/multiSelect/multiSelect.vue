<template>
  <div>
     <div :id='id' class="multi_select_" @click="selectShow">
         <slot></slot>
     </div>
    <div v-transfer-dom>
      <popup v-model="dropDown" position="bottom" max-height="50%">
        <div class="select_keyWorld" v-show="search">
          <x-input type="text" :placeholder="placeholder" v-model="params.keyWord" @on-change="onEnter" @on-enter="onEnter"></x-input>
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
  import { XInput, Checklist, Actionsheet, TransferDom, Popup, XButton } from 'vux'
  import request from '../js/request'
  export default {
    data () {
      return {
        rows: [
          {key: 'name1', value: 'value1'},
          {key: 'name2', value: 'value2'},
          {key: 'name3', value: 'value3'},
          {key: 'name4', value: 'value4'},
          {key: 'name5', value: 'value5'}
        ],
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
      Actionsheet,
      Popup,
      XButton
    },
    directives: {
      TransferDom
    },
    props: {
      id: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      search: {
        type: Boolean,
        default: false
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
      url (url) {
        this.getRows()
      }
    },
    mounted () {
      this.$nextTick(function () {
        if (this.url !== '') {
          this.getRows()
        }
      })
    },
    methods: {
      selectShow () {
        this.dropDown = true
      },
      onEnter () {
        this.getRows()
      },
      change (val, label) {
        console.log('change', val, label)
      },
      clickActionSheet () {
      },
      getRows () {
        request.get(this.url, this.params).then((data) => {
          this.rows = []
          if (data.success) {
            data.data.rows.forEach((item) => {
              this.rows.push({key: item[this.value], value: item[this.name]})
            })
          }
        }, (error) => {
          console.log(JSON.stringify('error===' + error))
        })
      },
      onOk () {
        this.dropDown = false
        console.log(this.selectValue)
        this.$emit('on-ok', this.selectValue)
      }
    }
  }
</script>

<style scoped>
</style>
