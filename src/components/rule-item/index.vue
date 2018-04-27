<template>

  <div>
    <selector v-model="rule.type" title="类型" :options="winTypeArray"></selector>
    <x-input title="系统业务" placeholder="点击选择系统组件" :readonly="true" v-model="rule.app" v-if="rule.type == 0"></x-input>
    <x-input title="IP地址" placeholder="多个IP以逗号分隔" @on-change="checkValue('ip')" v-model="rule.ip" v-if="rule.type == 10"></x-input>
    <x-input title="事件标题" placeholder="多个关键字以逗号分隔" @on-change="checkValue('title')" v-model="rule.title" v-if="rule.type == 20"></x-input>
    <x-input title="事件描述" placeholder="多个关键字以逗号分隔" @on-change="checkValue('summary')" v-model="rule.summary" v-if="rule.type == 30"></x-input>
  </div>

</template>

<script>


  import {Group, XInput, Selector} from 'vux'

  export default {
    name: "index",
    props: {
      rule: {
        type: Object,
        default: {}
      },
      index: {
        type: Number,
        default: 0
      },
      isChange : {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
      }
    },
    computed: {
      winTypeArray(){
        if(this.isChange){
          return  [{key: "0", value: '系统业务'}, {key: "10", value: 'IP地址'}]
        }
        return  [{key: "0", value: '系统业务'}, {key: "10", value: 'IP地址'}, {key: "20", value: '事件标题'}, {key: "30",value: '事件描述'}]
      }
    },
    methods: {
      checkValue(v){
        this.rule[v] = this.rule[v].replace(/，/g,",")
      }
    },
    watch: {
      rule: {
        handler(newValue, oldValue) {
          this.$emit("on-change", newValue, this.index)
        },
        deep: true
      }
    },
    components: {
      Group,
      XInput,
      Selector
    }
  }
</script>

<style scoped>

</style>
