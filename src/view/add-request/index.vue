<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">添加请求</x-header>
      <div class="wrapper-content">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">
          <selector v-model="Opinion" title="系统分类" @on-change="OpinionChange" :options="sda"></selector>
          <selector v-model="Opinion" title="所属系统" @on-change="OpinionChange" :options="sda"></selector>
          <selector v-model="checkNumber" title="是否查数" @on-change="OpinionChange" :options="checkNumberArray"></selector>
          <x-input title="标题" placeholder="请输入文字" v-model="title"></x-input>
          <x-textarea title="描述"  v-model="mContent" placeholder="请输入文字" :show-counter="false" :rows="5" :max="200"></x-textarea>
        </group>
      </div>
      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
    </div>
  </transition>
</template>

<script>

  import {XHeader} from 'vux'
  import {Group, XTextarea, XInput, Selector} from 'vux'
  import commFooter from 'components/comm-footer'

  export default {
    name: "index",
    data() {
      return {
        title:'',
        mContent: '',
        Opinion: '拟办',
        checkNumber: "否",
        checkNumberArray: ["是", "否"],
        sda : ['同意','拟办'],

        FlowActions: [
          {TypeId: 1, FlowActionName: "提交"},
          {TypeId: 2, FlowActionName: "暂存"}
        ]
      }
    },
    created() {
      setTimeout(() => {

      }, 20)
    },
    methods: {
      OpinionChange(v){
        this.$vux.toast.text( v+"", "bottom")
      },
      footerEvent(typeId){
        this.$vux.toast.text( typeId+"", "bottom")
      }
    },
    components: {
      commFooter,
      XHeader,
      Group,
      XTextarea,
      XInput,
      Selector
    }
  }
</script>

<style scoped>

  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    overflow-y: auto;
  }


</style>
