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

          <datetime v-model="bTime1" :end-date="eTime1" v-show="bindData.winType == '0'" format="YYYY-MM-DD HH:mm:ss" title="开始时间"></datetime>
          <datetime v-model="eTime1" :start-date="bTime1" v-show="bindData.winType == '0'" format="YYYY-MM-DD HH:mm:ss" title="结束时间"></datetime>

          <datetime v-model="bTime2" v-show="bindData.winType != '0'" format="YYYY-MM-DD" title="开始时间"></datetime>
          <datetime v-model="eTime2" v-show="bindData.winType != '0'" format="YYYY-MM-DD" title="结束时间"></datetime>
          <div v-show="bindData.winType != '0'" class="hr"></div>
          <hms-time v-show="bindData.winType != '0'" :value="bindData.loopStartTime" ref="loopStartTime" title="循环开始时间" @on-blur="verificationTime" @on-change="hmsTimeChange" ></hms-time>
          <div v-show="bindData.winType != '0'" class="hr"></div>
          <hms-time v-show="bindData.winType != '0'" :value="bindData.loopEndTime" ref="loopEndTime" title="循环结束时间" @on-blur="verificationTime" @on-change="hmsTimeChange"></hms-time>

          <!--<selector v-model="bindData.loopStartTime" v-show="bindData.winType != '0'" title="循环开始时间" :options="loopTimeArray()"></selector>-->
          <!--<selector v-model="bindData.loopEndTime" v-show="bindData.winType != '0'" title="循环结束时间" :options="loopTimeArray()"></selector>-->

          <x-textarea title="描述" v-model="bindData.desc" placeholder="请输入文字" :show-counter="false" :rows="5" :max="200"></x-textarea>
          <div class="hr"></div>

          <rule ref="rule" :rule="rule"></rule>
        </group>
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
  import SelectDay from 'components/select-day'
  import datetime from 'components/datetime'
  import hmsTime from 'components/hms-time'
  import Rule from 'components/rule'
  import {getUrl} from 'common/js/Urls'
  import {mapGetters} from 'vuex'
  import {maintainMixin} from "common/mixin/eventMixin"
  import utils from 'common/js/utils'

  export default {
    name: "index",
    mixins: [maintainMixin],
    data() {
      return {
        bTime1: '',     // 开始时间YYYY-MM-DD HH:mm:ss
        eTime1: '',     // 结束时间YYYY-MM-DD HH:mm:ss
        bTime2: '',     // 开始时间YYYY-MM-DD
        eTime2: '',     // 结束时间YYYY-MM-DD

        rule: [{type: 0, app: '', ip: '', title: '', summary: ''}],
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
          loopStartTime: "", // 循环开始时间
          loopEndTime: "",   // 循环结束时间
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
          {TypeId: 52, FlowActionName: "保存", id: this.$route.query.id, params: {type: 2}}
        ]
        if (this.$route.query.id) {
          actions = [
            {TypeId: 0, FlowActionName: "关闭"},
            {TypeId: 50, FlowActionName: "保存", id: this.$route.query.id, params: {type: 2, cid: this.$route.query.id}}
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
          // console.log("rule：" + JSON.stringify(this.$refs.rule.getData()))
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

        if(!this._checkData()) return
        if(!this.$refs.rule.getData()) return

        Object.assign(action.params, this.bindData, {rule: this.$refs.rule.getData()})

        //  删除多余参数 周期维护期【0:非周期维护期】【10:按天维护】【20:按周维护】【30:按月维护】
        if(this.bindData.winType == 0){
          delete action.params.daysOfWeek
          delete action.params.daysOfMonth
          delete action.params.loopStartTime
          delete action.params.loopEndTime
        }else if(this.bindData.winType == 10){
          delete action.params.daysOfWeek
          delete action.params.daysOfMonth
        }else if(this.bindData.winType == 20){
          delete action.params.daysOfMonth
        }else if(this.bindData.winType == 30){
          delete action.params.daysOfWeek
        }
        if(this.$route.query.id){ // 修改时
          action.params.cId = this.$route.query.id
          action.params.status = 0
        }
        this.submitEvent(action)
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

        // rule解析
        let rule = JSON.parse(this.maintain.rule), ruleArr = []
        if(rule.ip && rule.ip.length > 0 ) ruleArr.push({type: 10, app: '', ip: rule.ip[0].ip, title: '', summary: ''})
        if(rule.title && rule.title.length > 0 ) ruleArr.push({type: 20, app: '', ip: '', title: rule.title[0].title, summary: ''})
        if(rule.summary && rule.summary.length > 0 ) ruleArr.push({type: 30, app: '', ip: '', title: '', summary: rule.summary[0].summary})

        let app = JSON.parse(this.maintain.originalRule).app
        if(app.length > 0){
          /*for(let item of app){
            ruleArr.push({type: 0, app: this._parseCheckData(item), appData: item, ip: '', title: '', summary: ''})
          }*/
          ruleArr.push({type: 0, app: this._parseCheckData(app), appData: app, ip: '', title: '', summary: ''})
        }
        this.rule = ruleArr
      },
      _parseCheckData(data){
        let objS = data, appName = "", appAggregate = [];
        if(Array.isArray(objS)){
          objS.forEach(function (v,i) {
            if(v.objName!=""&&v.objName!=null){
              appName+="["+v.appName+"]包含组件["+v.objName+"]包含ip"+"["+v.ips+"],"
            }else {
              appName+="["+v.appName+"],"
            }
          })
        }else{
          if(objS.objName!=""&&objS.objName!=null){
            appName+="["+objS.appName+"]包含组件["+objS.objName+"]包含ip"+"["+objS.ips+"]"
          }else {
            appName+="["+objS.appName+"]"
          }
        }
        appAggregate=null
        objS=null
        return appName
      },
      verificationTime(val,title){
        console.log("verificationTime",val)
        if(title == '循环开始时间' )this.bindData.loopStartTime = val
        if(title == '循环结束时间' )this.bindData.loopEndTime = val
        if(this.bindData.loopStartTime == ''|| this.bindData.loopEndTime =='' ) return
        let _sTime_h = (+this.bindData.loopStartTime.split(":")[0] ) * 60 * 60
        let _sTime_m = (+this.bindData.loopStartTime.split(":")[1]) * 60
        let _eTime_h = (+this.bindData.loopEndTime.split(":")[0]) * 60 * 60
        let _eTime_m = (+this.bindData.loopEndTime.split(":")[1]) * 60
        let _sTime = _sTime_h + _sTime_m
        let _eTime = _eTime_h + _eTime_m
        console.log("循环开始时间："+_sTime,"循环结束时间："+_eTime)
        if(_sTime >= _eTime ){
          if(title == '循环开始时间'){
            this.bindData.loopStartTime = ''
            this.$refs.loopStartTime.setVal()
            this.$vux.toast.text(title + "不能大于结束时间", "center")
          }else {
            this.bindData.loopEndTime = ''
            this.$refs.loopEndTime.setVal()
            this.$vux.toast.text(title + "不能小于开始时间", "center")
          }
        }
      },
      hmsTimeChange ( value ,key) {
        const  newKey = {"循环开始时间":"loopStartTime","循环结束时间":'loopEndTime'}
        this.bindData[newKey[key]] = value
      }
    },
    components: {
      commFooter,
      datetime,
      SelectDay,
      Rule,
      hmsTime,

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
