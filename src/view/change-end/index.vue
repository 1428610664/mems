<template>

  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">变更结果确认</x-header>
      <div class="wrapper-content">
        <group label-width="5em" label-margin-right="2em" label-align="right">
          <datetime v-model="bindData.actualTime" format="YYYY-MM-DD HH:mm:ss" title="实际结束时间"></datetime>
          <selector v-model="bindData.result" title="运行结果" :options="resultArray"></selector>
          <x-textarea title="备注" v-model="bindData.remark" :show-counter="false" :rows="1" autosize></x-textarea>
        </group>
      </div>
      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
    </div>
  </transition>

</template>

<script>

  import {XHeader, Group, XTextarea, Selector} from 'vux'
  import commFooter from 'components/comm-footer'
  import datetime from 'components/datetime'
  import utils from 'common/js/utils'
  import {maintainMixin} from "common/mixin/eventMixin"

  export default {
    name: "index",
    mixins: [maintainMixin],
    data() {
      return {
        bindData: {
          actualTime: '',     // 实际结束时间
          result:'成功',
          remark: ''
        },
        checkData: {
          actualTime: {message: "请选择实际结束时间", check: "isEmpty"},
        },
        resultArray: ['成功','失败','回退']
      }
    },
    computed: {
      FlowActions() {
        let actions = [
          {TypeId: -1, FlowActionName: "关闭"},
          {TypeId: 52, FlowActionName: "确定", id: this.$route.query.id, params: {status: 3, id: this.$route.query.id}}
          ]
        return actions
      }
    },
    created() {

    },
    methods: {
      footerEvent(action) {
        if(action.TypeId == -1){ // 返回
          history.go(-1)
          return
        }
        if(!this._checkData()) return
        Object.assign(action.params, this.bindData)
        this.submitEvent(action)
      }
    },
    components: {
      commFooter,
      datetime,

      XHeader,
      Group,
      XTextarea,
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

  .wrapper-content {
    position: absolute;
    top: 46px;
    bottom: 45px;
    overflow: auto;
    width: 100%;
  }

</style>
