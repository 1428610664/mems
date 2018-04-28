<template>

  <div>
    <selector v-model="rule.type" title="类型" :options="winTypeArray"></selector>
    <!--<cell title="系统业务" :value="rule.app" v-if="rule.type == 0" @click.native="showTreeModel"></cell>-->
    <div class="hr" v-if="rule.type == 0"></div>
    <div class="app-wrapper"  v-if="rule.type == 0" @click="showTreeModel">
      <div class="title posct c4">系统业务</div>
      <div class="content">{{rule.app}}</div>
    </div>
    <x-input title="IP地址" placeholder="多个IP以逗号分隔" @on-change="checkValue('ip')" v-model="rule.ip" v-if="rule.type == 10"></x-input>
    <x-input title="事件标题" placeholder="多个关键字以逗号分隔" @on-change="checkValue('title')" v-model="rule.title" v-if="rule.type == 20"></x-input>
    <x-input title="事件描述" placeholder="多个关键字以逗号分隔" @on-change="checkValue('summary')" v-model="rule.summary" v-if="rule.type == 30"></x-input>
  </div>

</template>

<script>


  import {Group, XInput, Selector, Cell } from 'vux'

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
      },
      showTreeModel(){
        this.$emit("showTreeModel", this.index)
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
      Selector,
      Cell
    }
  }
</script>

<style scoped>

  .app-wrapper{
    display: -webkit-box;display: -ms-flexbox;display:flex;
    padding: 10px 0;
  }
  .content{
    -webkit-flex: 1;-ms-flex: 1;flex: 1;
  }
  .title{
    -webkit-flex: 0 0 6em;-ms-flex: 0 0 6em;flex:0 0 6em;text-align: left;
  }

</style>
