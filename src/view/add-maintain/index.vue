<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">{{isModify ? "修改维护期" : "添加维护期"}}</x-header>
      <div class="wrapper-content">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">

          <x-input title="名称" placeholder="请输入文字" v-model="bindData.cname"></x-input>
          <selector v-model="bindData.winType" title="维护周期" :options="winTypeArray"></selector>

          <x-input :value="_paseWeek(bindData.daysOfWeek)" :readonly="true" title="日期" v-show="bindData.winType == '20'" is-link @click.native="$refs.selectDay.show()"></x-input>
          <x-input :value="bindData.daysOfMonth" :readonly="true" title="日期" v-show="bindData.winType == '30'" is-link @click.native="$refs.selectWeek.show()"></x-input>

          <datetime v-model="bTime1" v-show="bindData.winType == '0'" format="YYYY-MM-DD HH:mm:ss" title="开始时间"></datetime>
          <datetime v-model="eTime1" v-show="bindData.winType == '0'" format="YYYY-MM-DD HH:mm:ss" title="结束时间"></datetime>
          <datetime v-model="bTime2" v-show="bindData.winType != '0'" format="YYYY-MM-DD" title="开始时间"></datetime>
          <datetime v-model="eTime2" v-show="bindData.winType != '0'" format="YYYY-MM-DD" title="结束时间"></datetime>

          <selector v-model="bindData.loopStartTime" v-show="bindData.winType != '0'" title="循环开始时间" :options="loopTimeArray()"></selector>
          <selector v-model="bindData.loopEndTime" v-show="bindData.winType != '0'" title="循环结束时间" :options="loopTimeArray()"></selector>

          <x-textarea title="描述" v-model="bindData.desc" placeholder="请输入文字" :show-counter="false" :rows="5" :max="200"></x-textarea>

           <check-tree></check-tree>
        </group>
         <!--<v-tree ref="tree2" :data='treeData2'/>-->


      </div>

      <select-day v-model="bindData.daysOfWeek" :options="weekArray()" ref="selectDay"></select-day>
      <select-day v-model="bindData.daysOfMonth" :options="monthArray()" ref="selectWeek"></select-day>
      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Group, XTextarea, XInput, Selector} from 'vux'
  import commFooter from 'components/comm-footer'
  import checkTree from 'components/check-tree'
  import SelectDay from 'components/select-day'
  import datetime from 'components/datetime'
  import {getUrl} from 'common/js/Urls'
  import {mapGetters} from 'vuex'
  import utils from 'common/js/utils'

  export default {
    name: "index",
    data() {
      return {

        treeData2: [{
          title: 'node1',
          expanded: true,
          children: [{title: 'node 1-1',children: [{title: 'node 1-1'}, {title: 'node 1-2'}]}, {title: 'node 1-2',children: [{title: 'node 1-1'}, {title: 'node 1-2'}]}]
        }],

        bTime1: '',     // 开始时间YYYY-MM-DD HH:mm:ss
        eTime1: '',     // 结束时间YYYY-MM-DD HH:mm:ss
        bTime2: '',     // 开始时间YYYY-MM-DD
        eTime2: '',     // 结束时间YYYY-MM-DD

        bindData: {
          cname: '',       // 维护期名称
          winType: '0',    // 周期维护期【0:非周期维护期】【10:按天维护】【20:按周维护】【30:按月维护】
          daysOfWeek: '', // 日期【周】
          daysOfMonth: '', // 日期【月】
          bTime: '',       // 开始时间
          eTime: '',       // 结束时间
          rule: {},         // 规则,json格式
          desc: '',         // 描述
          type: 2,          // 类型 【1:变更白板】【2:维护期】
          loopStartTime: false, // 循环开始时间
          loopEndTime: false,   // 循环结束时间
        },
        winTypeArray: [{key: "0", value: '非周期'}, {key: "10", value: '按天'}, {key: "20", value: '按周'}, {key: "30",value: '按月'}]
      }
    },
    created() {
      this.init()
    },
    computed: {
      ...mapGetters([
        'maintain',
      ]),
      isModify() {
        return this.maintain && this.$route.query.id ? true : false
      },
      FlowActions() {
        let actions = [
          {TypeId: 0, FlowActionName: "关闭"},
          {TypeId: 1, FlowActionName: "保存"}
        ]
        if (this.$route.query.id) {
          actions = [
            {TypeId: 0, FlowActionName: "关闭"},
            {TypeId: 1, FlowActionName: "保存"}
          ]
        }
        return actions
      },
      checkData(){
        let check = {
          cname: {message: "请输入标题", check: "isEmpty"},
          bTime: {message: "请选择开始时间", check: "isEmpty"},
          eTime: {message: "请选择结束时间", check: "isEmpty"},
        }
        let check2 = {
          loopStartTime: {message: "请选择循环开始时间", check: "isEmpty"},
          loopEndTime: {message: "请选择循环结束时间", check: "isEmpty"}
        }
        switch (this.bindData.winType){
          case "0":
            return check
          case "10":
            return Object.assign({}, check, check2)
          case "20":
            return Object.assign({}, check, {daysOfWeek: {message: "请选择日期", check: "isEmpty"}},check2)
          case "30":
            return Object.assign({}, check, {daysOfMonth: {message: "请选择日期", check: "isEmpty"}},check2)
        }
      }
    },
    methods: {
      footerEvent(action) {
        console.log(JSON.stringify(action))
        if (action.TypeId == 0) {
          history.go(-1)
          return
        }
        // 时间替换上
        if(this.bindData.winType == "0"){
          this.bindData.bTime = this.bTime1
          this.bindData.eTime = this.eTime1
        }else{
          this.bindData.bTime = this.bTime2
          this.bindData.eTime = this.eTime2
        }

        if(this._checkData()) return
      },
      _paseWeek(week) {
        let weekArr = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"], arr = []
        if(week.length == 0) return ""
        week = week.split("|")
        for(let i = 0, ilen = week.length; i < ilen; i++){
          arr.push(weekArr[week[i]*1])
        }
        return arr.join("|")
      },
      _checkData(){
        let mark = true
        for(var k in this.checkData){
          if(utils[this.checkData[k].check](this.bindData[k])){
            mark = false
            this.$vux.toast.text(this.checkData[k].message, "bottom")
            break
          }
        }
        return mark
      },
      init(){
        if(!this.isModify) return
        console.log(JSON.stringify(this.maintain))

        for(let k in this.bindData){
          this.bindData[k] = this.maintain[k]
        }
        // 其它属性赋值
        this.bindData.desc = this.maintain.cdesc
        this.bTime1 = new Date(this.maintain.beginTime.time).format("yyyy-MM-dd hh:mm:ss")
        this.eTime1 = new Date(this.maintain.endTime.time).format("yyyy-MM-dd hh:mm:ss")
        this.bTime2 = new Date(this.maintain.beginTime.time).format("yyyy-MM-dd")
        this.eTime2 = new Date(this.maintain.endTime.time).format("yyyy-MM-dd")
      }
    },
    components: {
      commFooter,
      datetime,
      SelectDay,
      checkTree,

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
