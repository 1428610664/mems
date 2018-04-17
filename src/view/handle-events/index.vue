<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">事件告警详情</x-header>
      <scroller lock-x scrollbarY height="-91">
        <div class="wrapper-content">
          <group label-width="4.5em" label-margin-right="2em" label-align="right">
            <x-input title="事件标题" placeholder="请输入文字" v-model="bindData.name" :readonly="readonly"></x-input>
            <x-textarea title="事件内容" v-model="bindData.summary" placeholder="请输入文字" :show-counter="false" :rows="5"
                        :max="200" :readonly="readonly"></x-textarea>
            <div class="hr"></div>
            <div class="hz-cell">
              <span class="label c4">状态</span>
              <span :class="getStatusType(status).class">{{getStatusType(status).title}}</span>
            </div>
            <div class="hr"></div>
            <app-select :url="sysTypeTypeUrl" title="系统分类" v-model="bindData.appType" :readonly="readonly"></app-select>
            <div class="hr"></div>
            <app-select title="所属系统" :url="sysTypeNameUrl" v-model="bindData.appName" :search="true" :param="sysTypeParam"
                        :isFirstRequest="false" :readonly="readonly"></app-select>
            <div class="hr"></div>
            <div class="hz-cell">
              <span class="label c4">优先级</span>
              <span class="severity_span" :style="{'background-color': getSeverity(bindData.severity).color}">{{getSeverity(bindData.severity).title}}</span>
            </div>
            <selector v-model="bindData.influence" title="影响度" :options="select.influence" @on-change="severityChange"  :readonly="readonly"></selector>
            <selector v-model="bindData.urgency" title="紧急度" :options="select.urgency" @on-change="severityChange"  :readonly="readonly"></selector>
            <selector v-model="bindData.type" title="事件类别" :options="select.type" :readonly="readonly"></selector>
            <selector v-model="bindData.attributes" title="事件属性" :options="select.attributes" :readonly="readonly"></selector>
            <x-input title="事件编号" :readonly="true" placeholder="请输入文字" v-model="serial"></x-input>
            <x-input title="事件时间" :readonly="true" v-model="bindData.faultTime"></x-input>
            <x-input title="提交人" :readonly="true" v-model="createUser"></x-input>
            <x-input title="提交时间" :readonly="true" v-model="createTime"></x-input>
            <div class="hr"></div>
            <div class="hz-cell">
              <div class="weui-cell__hd">
                <span class="label c4 in-line">提交部门</span>
              </div>
              <div class="weui-cell__bd">
                <span class="in-line" :title="departName">{{departName}}</span>
              </div>
            </div>
            <!--<x-input title="提交人部门" :readonly="true" v-model="departName"></x-input>-->
            <x-input title="满意度" :readonly="true" v-model="cacsi"></x-input>
            <x-input title="处理评价" :readonly="true" v-model="evaluate"></x-input>
            <div class="hr"></div>
            <div class="tab_div_height">
              <tabs-pan :id="rowId"></tabs-pan>
            </div>
          </group>
        </div>
      </scroller>

      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Group, Scroller, XTextarea, XInput, Selector} from 'vux'
  import commFooter from 'components/comm-footer'
  import appSelect from 'components/multi-select/app-select'
  import {getUrl} from 'common/js/Urls'
  import {eventMixin} from "common/mixin/eventMixin"
  import {mapGetters, mapMutations} from 'vuex'
  import {getUserInfo} from 'common/js/cache'
  import tabsPan from 'components/tabs-pan/tabs-pan'

  export default {
    name: "index",
    mixins: [eventMixin],
    data() {
      return {
        sysTypeTypeUrl: getUrl("appType"),
        sysTypeNameUrl: getUrl("appName"),
        readonly:false,
        rowId:this.$route.query.id,
        serial: '',    // 请求编号
        createTime: '',// 提交时间
        createUser: '', // 提交人
        departName: '', // 提交人部门
        cacsi: '',      // 满意度
        evaluate: '',   // 处理评价
        status: '',       // 状态
        bindData: {
          name: '',       // 标题
          summary: '',   // 内容
          faultTime: '', //事件时间
          appType: '',   // 系统分类
          appName: '' ,  // 所属系统
          severity:'0',  //优先级
          influence:'4' ,  //影响度
          urgency:'4' ,  //紧急度
          type:'1' ,  //事件类别
          attributes:'1' ,  //事件属性
        },
        rowKey: [
          {key:'severity',value:'0'},
          {key:'influence',value:'4'},
          {key:'urgency',value:'4'},
          {key:'type',value:'1'},
          {key:'attributes',value:'1'}
          ],

        checkData: {
          urgency: {message: "请选择紧急度", check: "isEmpty"},
          type: {message: "请选择事件类别", check: "isEmpty"},
          attributes: {message: "请选择事件属性", check: "isEmpty"},
        },

        select: {
          influence:[{key:"2",value:"高"},{key:"3",value:"中"},{key:"4",value:"低"}],
          urgency:[{key:"2",value:"高"},{key:"3",value:"中"},{key:"4",value:"低"}],
          type:[{key:"1",value:"普通"},{key:"2",value:"故障事件（可用性）"},{key:"3",value:"问询"}],
          attributes:[{key:"1",value:"一般事件"},{key:"2",value:"容量事件"},{key:"3",value:"信息安全事件"}],
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
      FlowActions(){
        if(!this.handleEvents) return []
        let actions = []
        let createUser = this.handleEvents.createUser.split("/")[1], handler = this.handleEvents.handler.split("/")[1];
        let userName = getUserInfo().user.userName, toUser = getUserInfo().toUser, role = getUserInfo().user.role
        this.readonly = false
        if(role != 5){
          this.readonly = true
          return []
        }
        if(this.status == 0){// 未处理
          if(createUser == userName || (toUser && toUser.split(",").indexOf(createUser) != -1)){
            actions = [
              {TypeId: 16, FlowActionName: "取消", id: this.$route.query.id},
            ]
          }else{
            actions = [
              {TypeId: 15, FlowActionName: "驳回", id: this.$route.query.id},
              {TypeId: 14, FlowActionName: "转派", id: this.$route.query.id},
              {TypeId: 22, FlowActionName: "转问询", id: this.$route.query.id},
            ]
          }
        }else if(this.status == 1) { // 处理中
          if(handler == userName || (toUser && toUser.split(",").indexOf(handler) != -1)){
            actions = [
              {TypeId: 14, FlowActionName: "转派", id: this.$route.query.id},
              {TypeId: 22, FlowActionName: "转问询", id: this.$route.query.id},
            ]
          }else{
            // edti 不可编辑
            this.readonly = true
          }
        }else if(this.status == 2) {  // 被驳回
          if(createUser == userName || (toUser && toUser.split(",").indexOf(createUser) != -1)){
            actions = [
              {TypeId: 16, FlowActionName: "取消", id: this.$route.query.id},
              {TypeId: 12, FlowActionName: "再次提交", id: this.$route.query.id},
            ]
          }else{
            this.readonly = true
          }
        }else if(this.status == 3){ // 待评价
          if(createUser == userName || (toUser && toUser.split(",").indexOf(createUser) != -1)){
            actions = [
              {TypeId: 19, FlowActionName: "提交评价", id: this.$route.query.id},
              {TypeId: 12, FlowActionName: "再次提交", id: this.$route.query.id},
            ]
          }else{
            this.readonly = true
          }
        }else{ // status == 4 || status == 99 || status == 100
          this.readonly = true
          actions = []
        }
        return actions
      }
    },
    created() {
      this._initWarning()
    },
    methods: {
      ...mapMutations({
        setHandleEvents: 'SET_HANDLE_EVENTS',
      }),
      footerEvent(action) {
        this.submitEvent(action)
      },
      _initWarning(){
        if (this.handleEvents) {
            for (var k in this.bindData) {
              this.bindData[k] = k == 'faultTime'? new Date(this.handleEvents[k].time).format("yyyy-MM-dd hh:mm:ss") :this.handleEvents[k]
            }
            this.rowKey.forEach((item)=>{
              this.bindData[item.key] = isNaN(+this.handleEvents[item.key])?  this.handleEvents[item] + '': item.value
            })
            this.serial = this.handleEvents.serial
            this.createTime = new Date(this.handleEvents.createTime.time).format("yyyy-MM-dd hh:mm:ss")
            this.createUser = this.handleEvents.createUser
            this.departName = this.handleEvents.departName
            this.cacsi = this.getCacsi(this.handleEvents.cacsi)
            this.status = this.handleEvents.status
            this.evaluate = this.handleEvents.evaluate
        }else {
          this.$router.replace('/myEvents')
        }
      },
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
      }
    },
    components: {
      commFooter,
      appSelect,
      tabsPan,

      XHeader,
      Group,
      Scroller,
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

  /*.wrapper-content {*/
    /*position: absolute;*/
    /*top: 46px;*/
    /*bottom: 45px;*/
    /*overflow: auto;*/
    /*width: 100%;*/
  /*}*/
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
  .wrapper-content:nth-last-child(1){
    padding-bottom: 0px;
  }
  .tab_div_height{ height: 230px;}
</style>
