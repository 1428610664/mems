<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">处理人工报障</x-header>
      <!--<scroller lock-x scrollbarY height="-91">-->
        <div class="wrapper-content">
          <group label-width="4.5em" label-margin-right="2em" label-align="right">
            <x-input title="报障标题" v-model="bindData.name" :readonly="true"></x-input>
            <x-textarea title="报障内容" v-model="bindData.summary" :show-counter="false" :rows="5"
                        :max="200" :readonly="true"></x-textarea>
            <div class="hr"></div>
            <div class="hz-cell">
              <span class="label c4">状态</span>
              <span :class="getStatusType(status).class">{{getStatusType(status).title}}</span>
            </div>
            <div class="hr"></div>
            <app-select :url="sysTypeTypeUrl" title="系统分类" v-model="bindData.appType" :readonly="readonly"></app-select>
            <div class="hr"></div>
            <app-select title="所属系统" :url="sysTypeNameUrl" v-model="bindData.appName" :search="true" :param="sysTypeParam" :readonly="readonly"></app-select>
            <div class="hr"></div>
            <div class="hz-cell">
              <span class="label c4">优先级</span>
              <span class="severity_span" :style="{'background-color': getSeverity(bindData.severity).color}">{{getSeverity(bindData.severity).title}}</span>
            </div>
            <selector v-model="bindData.influence" title="影响度" :options="select.influence" @on-change="severityChange"  :readonly="readonly"></selector>
            <selector v-model="bindData.urgency" title="紧急度" :options="select.urgency" @on-change="severityChange"  :readonly="readonly"></selector>
            <selector v-model="bindData.attributes" title="事件属性" :options="select.attributes" :readonly="readonly"></selector>
            <selector v-model="bindData.type" title="事件类别" :options="select.type" :readonly="readonly" @on-change="severityChange"></selector>
            <datetime v-if="bindData.type=='2'" v-model="bindData.serverBtime" :end-date="bindData.serverEtime" format="YYYY-MM-DD HH:mm:ss" title="服务开始时间" @on-change="serverTimeChange"></datetime>
            <datetime v-if="bindData.type=='2'" v-model="bindData.serverEtime" :start-date="bindData.serverBtime" format="YYYY-MM-DD HH:mm:ss" title="服务结束时间" @on-change="serverTimeChange"></datetime>
            <x-input v-if="bindData.type=='2'" title="服务影响时间" :readonly="true" v-model="bindData.serverAtime"></x-input>
            <x-input title="报障编号" :readonly="true"  v-model="serial"></x-input>
            <x-input title="报障时间" :readonly="true" v-model="bindData.faultTime"></x-input>
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
            <x-input v-show="status == 99 " title="满意度" :readonly="true" v-model="cacsi"></x-input>
            <x-input  v-show="status == 99 "  title="处理评价" :readonly="true" v-model="evaluate"></x-input>
            <div class="hr"></div>
            <!--<div class="tab_div_height">-->
            <tabs-pan :id="rowId" ref="tabspan" :showComments="tabObj.showComments" :showMsg="tabObj.showMsg" :paramsMsg="tabObj.paramsMsg"></tabs-pan>
              <!--<tabs-pan :id="rowId"></tabs-pan>-->
            <!--</div>-->
          </group>
        </div>
      <!--</scroller>-->

      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Group, Scroller, XTextarea, XInput, Selector} from 'vux'
  import commFooter from 'components/comm-footer'
  import appSelect from 'components/multi-select/app-select'
  import datetime from 'components/datetime/index'
  import {getUrl} from 'common/js/Urls'
  import {faultsMixin} from "common/mixin/eventMixin"
  import {mapGetters, mapMutations} from 'vuex'
  import {getUserInfo} from 'common/js/cache'
  import tabsPan from 'components/tabs-pan/tabs-pan'

  export default {
    name: "index",
    mixins: [faultsMixin],
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
          faultTime: '', //报障时间
          appType: '',   // 系统分类
          appName: '' ,  // 所属系统
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
          urgency: {message: "请选择紧急度", check: "isEmpty"},
          type: {message: "请选择事件类别", check: "isEmpty"},
          attributes: {message: "请选择事件属性", check: "isEmpty"},
        },

        select: {
          influence:[{key:"2",value:"高"},{key:"3",value:"中"},{key:"4",value:"低"}],
          urgency:[{key:"2",value:"高"},{key:"3",value:"中"},{key:"4",value:"低"}],
          type:[{key:"1",value:"普通"},{key:"2",value:"故障事件（可用性）"},{key:"3",value:"问询"}],
          attributes:[{key:"1",value:"一般事件"},{key:"2",value:"容量事件"},{key:"3",value:"信息安全事件"}],
        },
        tabObj:{
          paramsMsg:{
            refId: this.$route.query.id,
            type:2
          },
          showComments:false,
          showMsg:false,
        }
      }
    },
    computed: {
      ...mapGetters([
        'handleWarning',
      ]),
      sysTypeParam() {
        return {appType: this.bindData.appType}
      },
      FlowActions(){
        if(!this.handleWarning) return []
        let actions = []
        let createUser = this.handleWarning.createUser.split("/")[1], handler = this.handleWarning.handler
        let userName = getUserInfo().user.userName, role = getUserInfo().user.role
        let _userName =getUserInfo().user.name + '/' +userName
        this.readonly = false
        this.tabObj.showComments= false
        this.tabObj.showMsg= false
        if(role != 5){
          this.readonly = true
          return []
        }
        if(this.status == 0){// 未处理
          this.tabObj.showComments= true
          this.tabObj.showMsg= true
            actions = [
              {TypeId: 15, FlowActionName: "驳回", id: this.$route.query.id},
              {TypeId: 14, FlowActionName: "转派", id: this.$route.query.id},
              {TypeId: 22, FlowActionName: "转问询", id: this.$route.query.id}
            ]
        }else if(this.status == 1 && (handler == _userName || (handler && handler.indexOf(_userName) !=-1))) { // 处理中
          this.tabObj.showComments= true
          this.tabObj.showMsg= true
            actions = [
              {TypeId: 14, FlowActionName: "转派", id: this.$route.query.id},
            //  {TypeId: 22, FlowActionName: "转问询", id: this.$route.query.id}
            ]
        }else{
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
        setHandleWarning: 'SET_HANDLE_WARNING',
      }),
      footerEvent(action) {
        if(this.$refs.tabspan.getOpinionVal() == ''){
          this.$vux.toast.text("请填写处理意见", "bottom")
          return
        }else {
          this.bindData.opinion = this.$refs.tabspan.getOpinionVal()
        }
        this.submitEvent(action)
      },
      _initWarning(){
        if (this.handleWarning) {
            for (var k in this.bindData) {
              this.bindData[k] = k == 'faultTime'? new Date(this.handleWarning[k].time).format("yyyy-MM-dd hh:mm:ss") :this.handleWarning[k]
            }
            this.rowKey.forEach((item)=>{
              this.bindData[item.key] = isNaN(+this.handleWarning[item.key])?  this.handleWarning[item] + '': item.value
            })
            this.serial = this.handleWarning.serial
            this.createTime = new Date(this.handleWarning.createTime.time).format("yyyy-MM-dd hh:mm:ss")
            this.createUser = this.handleWarning.createUser
            this.departName = this.handleWarning.departName
            this.cacsi = this.getCacsi(this.handleWarning.cacsi)
            this.status = this.handleWarning.status
            this.evaluate = this.handleWarning.evaluate
        }else {
          this.$router.replace('/faultsWarning')
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
  /*.wrapper-content:nth-last-child(1){*/
    /*padding-bottom: 0px;*/
  /*}*/
  /*.tab_div_height{ height: 230px;}*/
</style>
