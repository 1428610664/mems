<template>

  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">{{isModify ? "修改变更" : "添加变更"}}</x-header>
      <div class="wrapper-content">
        <group label-width="5em" label-margin-right="2em" label-align="right">

          <x-input title="变更名称" v-model="bindData.cname"></x-input>
          <datetime v-model="bindData.bTime" :end-date="bindData.eTime" format="YYYY-MM-DD HH:mm:ss" title="开始时间"></datetime>
          <datetime v-model="bindData.eTime" :start-date="bindData.bTime" format="YYYY-MM-DD HH:mm:ss" title="结束时间"></datetime>

          <div class="hr"></div>
          <user-select :url="userUrl" title="通知用户" v-model="bindData.owner" :search="true"></user-select>

          <x-textarea v-model="bindData.desc" :show-counter="false" :rows="1" autosize></x-textarea>

          <div class="hr"></div>
          <rule ref="rule" :rule="rule" :isChange="true"></rule>

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
  import Rule from 'components/rule'
  import datetime from 'components/datetime'
  import {getUrl} from 'common/js/Urls'
  import {maintainMixin} from "common/mixin/eventMixin"
  import {mapGetters} from "vuex"

  export default {
    name: "index",
    mixins: [maintainMixin],
    data() {
      return {
        userUrl: getUrl("users"),
        rule: [{type: 0, app: '', ip: '', title: '', summary: ''}],
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
      ...mapGetters([
        'change',
      ]),
      isModify() {
        return this.change && this.$route.query.id ? true : false
      },
      FlowActions() {
        let actions = [
          {TypeId: -1, FlowActionName: "关闭"},
          {TypeId: 52, FlowActionName: "保存", id: this.$route.query.id, params: {type: 1}}
        ]
        // 修改变更
        if(this.isModify){
          actions = [
            {TypeId: -1, FlowActionName: "关闭"},
            {TypeId: 50, FlowActionName: "保存", id: this.$route.query.id, params: {type: 1, cid: this.$route.query.id}}
          ]
        }

        return actions
      }
    },
    created() {

      this.init()
    },
    methods: {
      footerEvent(action) {
        if(action.TypeId == -1){ // 返回
          history.go(-1)
          return
        }

        if(!this._checkData()) return
        if(this._trim(this.bindData.desc).length == 32){
          this.$vux.toast.text("请填写变更内容", "bottom")
          return
        }
        if(!this.$refs.rule.getData()) return

        Object.assign(action.params, this.bindData, {rule: this.$refs.rule.getData()})
        action.params.owner = this._parseOwner(action.params.owner) // 通知用户解析

        if(this.$route.query.id){ // 修改时
          action.params.cId = this.$route.query.id
          action.params.status = 0
        }
        this.submitEvent(action)
      },
      init(){
        if(!this.isModify) return
        for(let k in this.bindData){
          if(this.change[k]) this.bindData[k] = this.change[k]
        }
        this.bindData.bTime =  new Date(this.change.beginTime.time).format("yyyy-MM-dd hh:mm:ss")
        this.bindData.eTime =  new Date(this.change.endTime.time).format("yyyy-MM-dd hh:mm:ss")
        this.bindData.desc =  this.change.cdesc

        // rule解析
        let rule = JSON.parse(this.change.rule), ruleArr = []
        if(rule.ip.length > 0 ) ruleArr.push({type: 10, app: '', ip: rule.ip[0].ip, title: '', summary: ''})
        this.rule = ruleArr

      },
      /**
       * 去除空格、html标签、换行
       */
      _trim(str){
        str = str.replace(/<[^>]+>/g,"")
        str = str.replace(/\s+/g, "")
        str = str.replace(/<\/?.+?>/g,"")
        str = str.replace(/[\r\n]/g, "")
        return str
      },
      // 解析通知用户
      _parseOwner(user){
        user = user.split(",")
        let u = []
        for(let item of user){
          u.push(item.split("/")[0])
        }
        return u.join(",")
      }
    },
    components: {
      commFooter,
      datetime,
      userSelect,
      Rule,

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
