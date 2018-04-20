<template>

  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">维护期详情</x-header>
      <div class="wrapper-content" :class="FlowActions.length ? '' : 'bom'">
        <group label-width="5em" label-margin-right="2em" label-align="right">

          <x-input title="维护期名称" :readonly="true" v-model="bindData.cname"></x-input>
          <x-textarea title="描述" v-model="bindData.cdesc" :show-counter="false" :rows="1" autosize></x-textarea>
          <x-input title="维护期单号" :readonly="true" v-model="bindData.cid"></x-input>
          <div class="hr"></div>
          <div class="hz-cell"><span class="label c4">状态</span><span :class="getStateType(bindData.status).class">{{getStateType(bindData.status).title}}</span></div>
          <x-input title="创建时间" :readonly="true" v-model="bindData.createTime"></x-input>
          <x-input title="创建人" :readonly="true" v-model="bindData.createUser"></x-input>
          <x-input title="维护周期" :readonly="true" v-model="winType"></x-input>
          <x-input title="维护开始时间" :readonly="true" v-model="bindData.beginTime"></x-input>
          <x-input title="维护结束时间" :readonly="true" v-model="bindData.endTime"></x-input>
          <x-input title="开始时间" v-if="bindData.winType != 0" :readonly="true" v-model="bindData.loopStartTime"></x-input>
          <x-input title="结束时间" v-if="bindData.winType != 0" :readonly="true" v-model="bindData.loopEndTime"></x-input>
        </group>

        <div>
          <div class="cell-title c4 fz14">维护期规则</div>
          <div v-if="rule.ip" class="fz14" style="padding: 10px 15px">ip地址包含：{{rule.ip}}</div>
          <div class="fz14" v-if="rule.title" style="padding: 10px 15px">事件标题：{{rule.title}}</div>
          <div class="fz14" v-if="rule.summary" style="padding: 10px 15px">事件描述：{{rule.summary}}</div>
          <div v-if="rule.appTree.length">
            <div class="fz14" style="padding: 10px 15px">应用系统：</div>
            <v-tree ref="tree2" :data='rule.appTree'/>
          </div>
        </div>
      </div>
      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
    </div>
  </transition>

</template>

<script>

  import {XHeader, Group, XTextarea, XInput, Selector} from 'vux'
  import commFooter from 'components/comm-footer'
  import SelectDay from 'components/select-day'
  import datetime from 'components/datetime'
  import {getUrl} from 'common/js/Urls'
  import utils from 'common/js/utils'
  import SysAppUtils from 'common/js/SysAppUtils'
  import {mapGetters} from 'vuex'
  import {maintainMixin} from "common/mixin/eventMixin"

  export default {
    name: "index",
    mixins: [maintainMixin],
    data() {
      return {
        winType: "",

        // 维护期规则
        rule: {
          appTree: [],            // 应用系统
          ip: [],                  // ip地址
          title: '',              // 事件标题
          summary: '',            // 事件描述
        },
        bindData: {
          cname: '',             // 维护期名称
          cdesc: '',             // 内容
          cid: '',               // 单号
          status: '',           // 状态
          createTime: '',      // 创建时间
          createUser: '',      // 创建人
          winType: '',         // 维护周期
          beginTime: '',       // 维护开始时间
          endTime: '',         // 维护结束时间
          loopStartTime: '',  // 开始时间
          loopEndTime: '',    // 结束时间
        }
      }
    },
    computed: {
      ...mapGetters([
        'maintain',
      ]),
      FlowActions() {
        let actions = []
        if (this.bindData.status == 0) {
          actions = [// 修改、删除、禁用
            {TypeId: -1, FlowActionName: "修改", id: this.$route.query.id},
            {TypeId: 51, FlowActionName: "删除", id: this.$route.query.id, type: "delete"},
            {TypeId: 50, FlowActionName: "禁用", id: this.$route.query.id, params: {status: 4}}
          ]
        }else if(this.bindData.status == 1){
          actions = [
            {TypeId: 50, FlowActionName: "禁用", id: this.$route.query.id, params: {status: 4}}
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
        if(action.TypeId == -1){ // 修改跳至添加页面
          this.$router.replace({path: "/addMaintain",query:{id: this.$route.query.id}})
          return
        }
        this.submitEvent(action)
      },
      init() {
        if(!this.maintain || !this.$route.query.id){
          history.go(-1)
          return
        }
        // 基本数据赋值
        let arr = ["createTime", "beginTime", "endTime"]
        for (let k in this.bindData) {
          if(arr.indexOf(k) > -1){
            if(k == "beginTime" || k == "endTime"){
              this.bindData[k] = new Date(this.maintain[k].time).format(this.maintain.winType != 0 ? "yyyy-MM-dd" : "yyyy-MM-dd hh:mm:ss")
            }else{
              this.bindData[k] = new Date(this.maintain[k].time).format("yyyy-MM-dd hh:mm:ss")
            }
          }else{
            this.bindData[k] = this.maintain[k]
          }
        }
        // 维护周期赋值
        this.winType = this._getWinTypeTxt(this.maintain.winType)
        // 维护期规则赋值
        this._paseRule(JSON.parse(this.maintain.rule))
      },
      _getWinTypeTxt(type){
        switch (type){
          case 0:
            return "非周期维护期"
          case 10:
            return "按天维护"
          case 20:
            return "每周"+this._getWeek(this.maintain.daysOfWeek.split("|"))+"维护"
          case 30:
            return "每月"+this.maintain.daysOfMonth+"维护"
          default:
            return ""
        }
      },
      /**
       * 根据0123456返回"日","一","二","三","四","五","六"
       */
      _getWeek(arr){
        let week = ["日","一","二","三","四","五","六"], selWeek = []
        for(let k of arr){
          selWeek.push(week[k])
        }
        return selWeek.join("、")
      },
      /**
       * 解析维护期规则
       * @param rule
       * @private
       */
      _paseRule(rule){
        this.rule.appTree = SysAppUtils.getTreeDate(rule.app)

        let ips = [], titles = [],summarys = []
        for(let k of rule.ip){
          ips.push(k.ip)
        }
        for(let k of rule.title){
          titles.push(k.title)
        }
        for(let k of rule.summary){
          summarys.push(k.summary)
        }
        this.rule.ip = ips.join(",")
        this.rule.title = titles.join(",")
        this.rule.summary = summarys.join(",")
      }
    },
    components: {
      commFooter,
      datetime,
      SelectDay,

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
  .wrapper-content.bom{
    bottom: 0;
  }

  .cell-title{
    padding: 10px 15px;
  }

</style>
