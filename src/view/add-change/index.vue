<template>

  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">添加变更</x-header>
      <div class="wrapper-content">
        <group label-width="5em" label-margin-right="2em" label-align="right">

          <x-input title="变更名称" v-model="bindData.cname"></x-input>
          <datetime v-model="bindData.bTime" :end-date="bindData.eTime" format="YYYY-MM-DD HH:mm:ss" title="开始时间"></datetime>
          <datetime v-model="bindData.eTime" :start-date="bindData.bTime" format="YYYY-MM-DD HH:mm:ss" title="结束时间"></datetime>

          <div class="hr"></div>
          <user-select :url="userUrl" title="通知用户" v-model="bindData.owner" :search="true"></user-select>

          <x-textarea v-model="bindData.desc" :show-counter="false" :rows="1" autosize></x-textarea>
        </group>
      </div>
      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
    </div>
  </transition>

</template>

<script>

  import {XHeader, Group, XTextarea, XInput, Selector} from 'vux'
  import commFooter from 'components/comm-footer'
  import userSelect from 'components/multi-select/user-select'
  import datetime from 'components/datetime'
  import {getUrl} from 'common/js/Urls'
  import {maintainMixin} from "common/mixin/eventMixin"

  export default {
    name: "index",
    mixins: [maintainMixin],
    data() {
      return {
        userUrl: getUrl("users"),

        bindData: {
          cname: '',           // 变更名称
          bTime: '',       // 开始时间
          eTime: '',       // 结束时间
          owner: '',           // 通知用户
          desc: '一、变更内容\n\n二、变更影响范围\n\n三、变更步骤\n\n四、验证方法\n\n五、回退方案\n',    // 内容
        },
        checkData: {
          cname: {message: "请输入变更名称", check: "isEmpty"},
          bTime: {message: "请选择开始时间", check: "isEmpty"},
          eTime: {message: "请选择结束时间", check: "isEmpty"},
          owner: {message: "请选择通知用户", check: "isEmpty"},
        },
        resultArray: ['成功','失败','回退']
      }
    },
    computed: {
      FlowActions() {
        let actions = [
          {TypeId: -1, FlowActionName: "关闭"},
          {TypeId: 50, FlowActionName: "保存", id: this.$route.query.id, params: {type: 1}}
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

        return
        Object.assign(action.params, this.bindData)
        this.submitEvent(action)
      }
    },
    components: {
      commFooter,
      datetime,
      userSelect,

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

  .wrapper-content {
    position: absolute;
    top: 46px;
    bottom: 45px;
    overflow: auto;
    width: 100%;
  }

</style>
