<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">事件告警详情</x-header>
        <div class="wrapper-content">
          <group label-width="4.5em" label-margin-right="2em" label-align="right">
            <x-input title="事件标题" v-model="handleEvents.name" :readonly="true"></x-input>
           <!-- <x-textarea title="事件内容" v-model="handleEvents.summary" :show-counter="false" :rows="5"
                        :max="200" :readonly="true"></x-textarea>-->
            <div class="weui-cell vux-x-textarea">
              <div class="weui-cell__hd">
                <label class="weui-label" style="width: 5em; text-align: right; margin-right: 2em;">请求描述</label>
              </div>
              <div class="weui-cell__bd" v-html="handleEvents.summary"></div>
            </div>
            <x-input title="事件编号" :readonly="true" v-model="handleEvents.serial"></x-input>
            <x-input title="主机名" :readonly="true" v-model="handleEvents.hostName"></x-input>
            <x-input title="主机IP" :readonly="true" v-model="handleEvents.ip"></x-input>
            <x-input title="首次发生时间" :readonly="true" v-model="firstOccurrence"></x-input>
            <x-input title="最后发生时间" :readonly="true" v-model="lastOccurrence"></x-input>
            <x-input title="发生次数" :readonly="true" v-model="handleEvents.tally"></x-input>
            <x-input title="事件来源" :readonly="true" v-model="sourceAgent"></x-input>
            <div class="hr"></div>
            <div class="hz-cell">
              <span class="label c4">状态</span>
              <span :class="getEventStatusType(handleEvents).class">{{getEventStatusType(handleEvents).title}}</span>
            </div>
            <div class="hr"></div>
            <app-select :url="sysTypeTypeUrl" title="系统分类" v-model="bindData.appType" :readonly="readonly"></app-select>
            <div class="hr"></div>
            <app-select title="所属系统" :url="sysTypeNameUrl" v-model="bindData.appName" :search="true" :param="sysTypeParam"  :readonly="readonly"></app-select>
            <div class="hr"></div>
            <app-select title="所属组件" :url="sysTypeComponentUrl" v-model="bindData.component" :search="true" :param="sysNameParam" :readonly="readonly"></app-select>
            <div class="hr"></div>
            <div class="hz-cell">
              <span class="label c4">优先级</span>
              <span class="severity_span" :style="{'background-color': getSeverity(bindData.severity).color}">{{getSeverity(bindData.severity).title}}</span>
            </div>
            <selector v-model="bindData.influence" title="影响度" :options="select.influence" @on-change="severityChange"  :readonly="readonly"></selector>
            <selector v-model="bindData.urgency" title="紧急度" :options="select.urgency" @on-change="severityChange"  :readonly="readonly"></selector>
            <selector v-model="bindData.attributes" title="事件属性" :options="select.attributes" :readonly="readonly"></selector>
            <selector v-model="bindData.type" title="事件类别" :options="select.type" :readonly="readonly"></selector>
            <datetime v-if="bindData.type=='2'" v-model="bindData.serverBtime" :end-date="bindData.serverEtime" format="YYYY-MM-DD HH:mm:ss" title="服务开始时间" @on-change="serverTimeChange"></datetime>
            <datetime v-if="bindData.type=='2'" v-model="bindData.serverEtime" :start-date="bindData.serverBtime" format="YYYY-MM-DD HH:mm:ss" title="服务结束时间" @on-change="serverTimeChange"></datetime>
            <x-input v-if="bindData.type=='2'" title="服务影响时间" :readonly="true" v-model="bindData.serverAtime"></x-input>
            <x-input title="当前责任人" :readonly="true" v-model="handleEvents.handler"></x-input>
            <!--<div class="hr"></div>-->
            <!--<div class="hz-cell">-->
              <!--<div class="weui-cell__hd">-->
                <!--<span class="label c4 in-line">提交部门</span>-->
              <!--</div>-->
              <!--<div class="weui-cell__bd">-->
                <!--<span class="in-line" :title="handleEvents.departName">{{handleEvents.departName}}</span>-->
              <!--</div>-->
            <!--</div>-->
            <x-input v-if="status == '99'" title="关闭方式" :readonly="true" v-model="closeType"></x-input>
            <cell v-if="status == '99'" title="事件原因" :value="handleEvents.rootCause"></cell>

            <div class="hr"></div>
            <tabs-pan :id="rowId" ref="tabspan" :showComments="tabObj.showComments" :showMsg="tabObj.showMsg" :paramsMsg="tabObj.paramsMsg"></tabs-pan>

          </group>
        </div>

      <v-confirm v-model="shieldModel"
               :show-selector="true"
               defaultValue="误报"
               selectorTitle="屏蔽原因"
               :selectorOptions='[ "误报", "未设置维护期"]'
               title=" 屏蔽事件 "
               @on-confirm="onShieldModelConfirm">
      </v-confirm>

      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Group, Scroller, XTextarea, XInput, Selector,XSwitch, Cell} from 'vux'
  import commFooter from 'components/comm-footer'
  import appSelect from 'components/multi-select/app-select'
  import VConfirm from 'components/confirm'
  import datetime from 'components/datetime/index'
  import {getUrl} from 'common/js/Urls'
  import {eventsMixin} from "common/mixin/eventMixin"
  import {mapGetters, mapMutations} from 'vuex'
  import {getUserInfo} from 'common/js/cache'
  import tabsPan from 'components/tabs-pan/tabs-pan'

  export default {
    name: "index",
    mixins: [eventsMixin],
    data() {
      return {
        shieldModel: false,   // 屏蔽Model
        shileModelAction : null,

        sysTypeTypeUrl: getUrl("appType"),
        sysTypeNameUrl: getUrl("appName"),
        sysTypeComponentUrl: getUrl("component"),
        readonly:false,
        rowId:this.$route.query.id,
        selectIndex:this.$route.query.selectIndex,
        rows:{},
        firstOccurrence: '',
        lastOccurrence: '',
        sourceAgent: '',
        closeType: '',
        status: '',       // 状态
        bindData: {
          appType: '',   // 系统分类
          appName: '' ,  // 所属系统
          component : '' ,  // 所属组件
          severity:'0',  //优先级
          influence:'4' ,  //影响度
          urgency:'4' ,  //紧急度
          type:'1' ,  //事件类别
          attributes:'1' ,  //事件属性
          serverBtime:'', //服务开始时间
          serverEtime:'', //服务结束时间
          serverAtime:'', //服务影响时长
          opinion: ''  //处理意见
        },
        rowKey: [
          {key:'severity',value:'0'},
          {key:'influence',value:'4'},
          {key:'urgency',value:'4'},
          {key:'type',value:'1'},
          {key:'attributes',value:'1'}
          ],

        checkData: {
          // urgency: {message: "请选择紧急度", check: "isEmpty"},
        },

        select: {
          influence:[{key:"2",value:"高"},{key:"3",value:"中"},{key:"4",value:"低"}],
          urgency:[{key:"2",value:"高"},{key:"3",value:"中"},{key:"4",value:"低"}],
          type:[{key:"1",value:"普通"},{key:"2",value:"故障事件（可用性）"},{key:"3",value:"问询"}],
          attributes:[{key:"1",value:"一般事件"},{key:"2",value:"容量事件"},{key:"3",value:"信息安全事件"}],
        },
        tabObj:{
          paramsMsg:{
            refId: '',
            type:1
          },
          showComments:false,
          showMsg:false,
        }
      }
    },
    computed: {
      ...mapGetters([
        'handleEvents',
      ]),
      sysTypeParam() {
            return {appType: this.bindData.appType}
      },
      sysNameParam() {
           return {appName: this.bindData.appName}
      },
      FlowActions(){
        if(!this.handleEvents) return []
        let userName = getUserInfo().user.userName, role = getUserInfo().user.role
        let _userName = getUserInfo().user.name +"/" + userName, handler =this.handleEvents.handler
        let toUser = getUserInfo().toUser
        this.readonly = true
        this.tabObj.showComments= false
        this.tabObj.showMsg= false
        if(this.status == 99 || this.selectIndex == 2 ){
          return []
        }
        let actions = []
        const buttons = [
          {TypeId: 30, FlowActionName: "关单", id: this.handleEvents.serial}, //0
          {TypeId: 34, FlowActionName: "转问询单", id: this.handleEvents.serial},//1
          {TypeId: 37, FlowActionName: "取消误报", id: this.handleEvents.serial},//2
          {TypeId: 26, FlowActionName: "转派", id:this.handleEvents.serial}, //3
          {TypeId: 32, FlowActionName: "受理", id: this.handleEvents.serial}, //4
          {TypeId: 25, FlowActionName: "取消屏蔽", id: this.handleEvents.serial}, //5
          {TypeId: 29, FlowActionName: "误报", id: this.handleEvents.serial}, //6
          {TypeId: 24, FlowActionName: "屏蔽", id: this.handleEvents.serial, params: {eventCause: ''}}, //7
          {TypeId: 36, FlowActionName: "响应", id: this.handleEvents.serial} //8
        ]
        if(role == '5' && (this.status == 0 || this.status == 1)){ //服务台 未受理 处理中
          this.tabObj.showComments= true
          this.tabObj.showMsg= true
          actions = [buttons[8],buttons[3]]
        }else if( role !=  '5' && ((handler && handler.indexOf(_userName) != -1 ) || (toUser && handler.indexOf(toUser) != -1))){
          this.tabObj.showComments= true
          this.tabObj.showMsg= true
          this.readonly = false
          switch (this.status + "") {
            case "0": //未处理：:
                actions = [buttons[4],buttons[3]]  //受理 转派
              break;
            case "1": //处理中
                actions = [buttons[3],buttons[0],buttons[7]] //转派 关单 屏蔽
              break;
            case "3": //已屏蔽
               actions = [buttons[5],buttons[0]]  //取消屏蔽 关单
              break;
            default:
              this.readonly = true
              this.tabObj.showComments= false
              this.tabObj.showMsg= false
          }
        }else {

        }
        return actions
      }
    },
    created() {
      this._initEvent()
    },
    methods: {
      ...mapMutations({
        setHandleEvents: 'SET_HANDLE_EVENTS',
      }),
      footerEvent(action) {
        //   console.log( this.$refs.tabssd.getOpinionVal())
        if(action.TypeId == 24){  // 点击屏蔽
          this.shieldModel = true
          this.shileModelAction = action
          return
        }
        if(this.$refs.tabspan.getOpinionVal() == ''){
          this.$vux.toast.text("请填写处理意见", "bottom")
          return
        }else {
          this.bindData.opinion = this.$refs.tabspan.getOpinionVal()
        }
        this.submitEvent(action)
      },
      // 屏蔽弹窗确认
      onShieldModelConfirm(value){
        this.shileModelAction.params.eventCause = value
        this.submitEvent(this.shileModelAction)
      },
      _initEvent(){
        if (this.handleEvents) {
          for (var k in this.bindData) {
              this.bindData[k] = k == 'serverBtime' ||  k == 'serverEtime' ? this.getFormatTime(this.handleEvents[k]) :this.handleEvents[k]
            }
          this.rowKey.forEach((item)=>{
              this.bindData[item.key] = isNaN(+this.handleEvents[item.key])?  this.handleEvents[item.key] + '': item.value
          })
          this.status = this.handleEvents.status
          this.firstOccurrence =  this.getFormatTime(this.handleEvents.firstOccurrence)
          this.lastOccurrence =  this.getFormatTime(this.handleEvents.lastOccurrence)
          this.sourceAgent =  this.getSourceAgent(this.handleEvents.sourceAgent)
          this.closeType =  this.eventCloseType(this.handleEvents)
          this.tabObj.paramsMsg.refId = this.handleEvents.cid
        }else {
          this.$router.replace('/myEvents')
        }
      },
      /**
       * 优先级计算
       */
      severityChange (){
          let _val = parseInt(this.bindData.influence)+parseInt(this.bindData.urgency);
          if(isNaN(_val)){
             this.bindData.severity = 0
          }else{
            switch (_val){
              case 4:
                this.bindData.severity = 1
                break
              case 5:
                this.bindData.severity =2
                break
              case 6:
                this.bindData.severity = 3
                break
              default :
                this.bindData.severity = 4
            }
          }
      },
      /**
       *计算服务影响时间
       */
      serverTimeChange (){
        if(this.bindData.serverEtime != '' &&this.bindData.serverBtime != ''){
          this.bindData.serverAtime =  Date.timeOfDuration(new Date(this.bindData.serverEtime.replace(/-/g, "/")).getTime() - new Date(this.bindData.serverBtime.replace(/-/g, "/")).getTime())
        }else {
          this.bindData.serverAtime = ''
        }
      }
    },
    components: {
      commFooter,
      appSelect,
      datetime,
      tabsPan,
      VConfirm,

      XHeader,
      Group,
      Scroller,
      XTextarea,
      XInput,
      Selector,
      XSwitch,
      Cell
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
  .hz-cell{
    padding: 10px 15px;
    position: relative;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .hz-cell .label{
    width: 4.5em;
    text-align: right;
    margin-right: 2em;
  }
  .severity_span{
    display: inline-block;
    width: 70px;
    text-align: center;
    border-radius: 10px;
  }
</style>
