<!--普通用户报障详情-->
<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">处理人工报障</x-header>
      <!--<scroller lock-x scrollbarY height="-91">-->
      <div class="wrapper-content">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">
          <x-input title="报障标题" placeholder="请输入文字" v-model="bindData.name" :readonly="readonly"></x-input>
          <x-textarea title="报障内容" v-model="bindData.summary" placeholder="请输入文字" :show-counter="false" :rows="5"
                      :max="200" :readonly="readonly"></x-textarea>
          <div class="hr"></div>
          <div class="hz-cell">
            <span class="label c4">状态</span>
            <span :class="getStatusType(status).class">{{getStatusType(status).title}}</span>
          </div>
          <div class="hr"></div>
          <app-select :url="sysTypeTypeUrl" title="系统分类" v-model="bindData.appType" :search="true" :readonly="readonly"></app-select>
          <div class="hr"></div>
          <app-select title="所属系统" :url="sysTypeNameUrl" v-model="bindData.appName" :search="true" :param="sysTypeParam"
                      :readonly="readonly"></app-select>
          <x-input title="报障编号" :readonly="true" placeholder="请输入文字" v-model="serial"></x-input>
          <x-input title="报障时间" :readonly="true" v-model="bindData.faultTime"></x-input>
          <x-input title="提交人" :readonly="true" v-model="createUser"></x-input>
          <x-input title="提交时间" :readonly="true" v-model="createTime"></x-input>
          <x-input  v-show="evaluateObj.isShow" title="满意度" :readonly="true" v-model="cacsi"></x-input>
          <!--<selector v-show="cacsiSelect=='show'" v-model="cacsiKey" title="满意度" :options="select.cacsi"></selector>-->
          <x-input v-show="evaluateObj.isShow" title="处理评价" :readonly="true" v-model="evaluate"></x-input>
          <div class="hr"></div>
          <!--<div class="tab_div_height">-->
            <tabs-pan :id="rowId"></tabs-pan>
          <!--</div>-->
          <div v-if="evaluateObj.isEvaluate && status == 3">
            <evaluate-wrapper ref="evaluateWrapper"></evaluate-wrapper>
          </div>
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
  import EvaluateWrapper from 'components/evaluate-wrapper'
  import commFooter from 'components/comm-footer'
  import appSelect from 'components/multi-select/app-select'
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
        readonly: false,
        rowId:this.$route.query.id,
        serial: '',    // 请求编号
        createTime: '',// 提交时间
        createUser: '', // 提交人

        cacsi: '',      // 满意度
        //cacsiKey:'30', // 满意度
        //cacsiSelect:'hide',

        evaluate: '',   // 处理评价
        status: '',       // 状态
        bindData: {
          name: '',       // 标题
          summary: '',   // 内容
          faultTime: '', //报障时间
          appType: '',   // 系统分类
          appName: ''    // 所属系统
        },
        select:{
          cacsi:[{key:"10",value:"不满意"},{key:"20",value:"一般"},{key:"30",value:"满意"}]
        },

        checkData: {
          name: {message: "请输入标题", check: "isEmpty"},
          summary: {message: "请输入描述", check: "isEmpty"},
          appType: {message: "请选择系统分类", check: "isEmpty"},
          appName: {message: "请选择所属系统", check: "isEmpty"},
        },

        checkNumberArray: [{key: "1", value: '是'}, {key: "2", value: '否'}]
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
        let createUser = this.handleWarning.createUser.split("/")[1]
        let userName = getUserInfo().user.userName, role = getUserInfo().user.role
        this.readonly = false
        if(role != 4){ //普通用户报障详情
          this.readonly = true
          return []
        }
        if(createUser == userName) {// 未处理
          switch (this.status + "") {
            case '0': //未处理
              actions = [{TypeId: 16, FlowActionName: "取消报障", id: this.$route.query.id}]
              break
            case '2':  // 被驳回
              actions = [
                {TypeId: 16, FlowActionName: "取消报障", id: this.$route.query.id},
                {TypeId: 12, FlowActionName: "再次提交", id: this.$route.query.id}
              ]
              break
            case '3': // 待评价
              actions = [
                {TypeId: 19, FlowActionName: "提交评价", id: this.$route.query.id},
                {TypeId: 12, FlowActionName: "再次提交", id: this.$route.query.id},
              ]
              break
            default:
              this.readonly = true
              actions = []
          }
        }else {
          this.readonly = true
          actions = []
        }
        return actions
      },
      evaluateObj(){
        if (!this.handleWarning) return {isShow : false, isEvaluate: false}
        let createUser = this.handleWarning.createUser.split("/")[1]
        let isShow = this.status == 99
        let isEvaluate = createUser == getUserInfo().user.userName
        return {isShow : isShow, isEvaluate: isEvaluate}
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
        if(action.TypeId == 19){
          let evaluate = this.$refs.evaluateWrapper.getEvaluate()
          if(!evaluate) return
          action.params = {evaluate: evaluate.evaluate, cacsi: evaluate.cacsi.key}
        }
        this.submitEvent(action)
      },
      _initWarning(){
        if (this.handleWarning) {
            for (var k in this.bindData) {
              this.bindData[k] = k == 'faultTime'? new Date(this.handleWarning[k].time).format("yyyy-MM-dd hh:mm:ss") :this.handleWarning[k]
            }
            this.serial = this.handleWarning.serial
            this.createTime = new Date(this.handleWarning.createTime.time).format("yyyy-MM-dd hh:mm:ss")
            this.createUser = this.handleWarning.createUser
            this.cacsi = this.getCacsi(this.handleWarning.cacsi)
           // this.cacsiKey =  this.handleWarning.cacsi== 0 ?  "30":this.handleWarning.cacsi + ''
            this.status = this.handleWarning.status
            this.evaluate = this.handleWarning.evaluate
        }else {
          this.$router.replace('/faultsWarning')
        }
      }
    },
    components: {
      EvaluateWrapper,
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
  .wrapper-content:nth-last-child(1){
    padding-bottom: 0px;
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
  /*.wrapper-content:nth-last-child(1){*/
    /*padding-bottom: 0px;*/
  /*}*/
  /*.tab_div_height{ height: 230px;}*/
</style>
