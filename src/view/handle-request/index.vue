<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">处理服务请求</x-header>
      <div class="wrapper-content" :class="FlowActions.length ? '' : 'bom'">
        <group label-width="5em" label-margin-right="2em" label-align="right">
          <x-input title="请求标题" :readonly="isEdit" placeholder="请输入文字" v-model="bindData.name"></x-input>
         <!-- <x-textarea title="请求描述" :readonly="isEdit" v-model="bindData.summary" placeholder="请输入文字"
                      :show-counter="false" :rows="5"
                      :max="200"></x-textarea>-->

          <div class="weui-cell vux-x-textarea">
            <div class="weui-cell__hd">
              <label class="weui-label" style="width: 5em; text-align: right; margin-right: 2em;">请求描述</label>
            </div>
            <div class="weui-cell__bd" v-html="bindData.summary"></div>
          </div>
          <x-input title="请求编号" :readonly="true" placeholder="请输入文字" v-model="serial"></x-input>
          <div class="hr"></div>
          <div class="hz-cell">
            <span class="label c4">状态</span>
            <span :class="getStatusType(status).class">{{getStatusType(status).title}}</span>
          </div>
          <x-input v-model="bindData.type == 1 ? '是' : '否'" v-if="isEdit" :readonly="true" title="是否查数"></x-input>
          <selector v-model="bindData.type" v-if="!isEdit" title="是否查数" :options="checkNumberArray"></selector>
          <div class="hr"></div>
          <app-select :url="sysTypeTypeUrl" :readonly="isEdit" title="系统分类" :search="true" v-model="bindData.appType"></app-select>
          <div class="hr"></div>
          <app-select title="所属系统" :readonly="isEdit" :url="sysTypeNameUrl" :search="true" v-model="bindData.appName"
                      :param="sysTypeParam"></app-select>
          <x-input title="提交时间" :readonly="true" v-model="createTime"></x-input>
          <!--<x-input title="当前处理人" :readonly="true" v-model="handler"></x-input>-->
          <div class="hr"></div>
          <div class="hz-cell">
            <div class="weui-cell__hd">
              <span class="label c4 in-line">当前处理人</span>
            </div>
            <div class="weui-cell__bd">
              <span class="in-line" :title="handler">{{handler}}</span>
            </div>
          </div>
          <x-input title="提交人" :readonly="true" v-model="createUser"></x-input>
          <x-input title="满意度" v-if="evaluateObj.isShow" :readonly="true" v-model="cacsi"></x-input>
          <x-input title="处理评价" v-if="evaluateObj.isShow" :readonly="true" v-model="evaluate"></x-input>

          <div class="hr"></div>
          <tabs-pan :id="rowId" :opinionUrl="opinionUrl"  ref="tabspan" :showComments="tabObj.showComments" :showMsg="tabObj.showMsg" :paramsMsg="tabObj.paramsMsg"></tabs-pan>

          <div v-if="evaluateObj.isEvaluate && status != 99">
            <evaluate-wrapper ref="evaluateWrapper"></evaluate-wrapper>
          </div>
        </group>
      </div>

      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Group, XTextarea, XInput, Selector} from 'vux'
  import commFooter from 'components/comm-footer'
  import EvaluateWrapper from 'components/evaluate-wrapper'
  import TabsPan from 'components/tabs-pan/tabs-pan'
  import appSelect from 'components/multi-select/app-select'
  import {getUrl} from 'common/js/Urls'
  import {handleRequestMixin} from "common/mixin/eventMixin"
  import {mapGetters, mapMutations} from 'vuex'
  import {getUserInfo} from 'common/js/cache'

  export default {
    name: "index",
    mixins: [handleRequestMixin],
    data() {
      return {
        sysTypeTypeUrl: getUrl("appType"),
        sysTypeNameUrl: getUrl("appName"),
        rowId: this.$route.query.id,
        opinionUrl: getUrl("serviceOpinion", this.$route.query.id), // 处理事件请求Url
        isEdit: false,
        serial: '',    // 请求编号
        createTime: '',// 提交事件
        handler: '',    // 当前处理人
        createUser: '', // 提交人
        cacsi: '',      // 满意度
        evaluate: '',   // 处理评价
        status: '',       // 状态
        bindData: {
          name: '',       // 标题
          summary: '',   // 内容
          type: '2',     // 是否查数
          appType: '',   // 系统分类
          appName: ''    // 所属系统
        },
        checkData: {
          name: {message: "请输入标题", check: "isEmpty"},
          summary: {message: "请输入描述", check: "isEmpty"},
          appType: {message: "请选择系统分类", check: "isEmpty"},
          appName: {message: "请选择所属系统", check: "isEmpty"},
        },
        checkNumberArray: [{key: "1", value: '是'}, {key: "2", value: '否'}],
        tabObj:{
          paramsMsg:{
            refId: '',
            type:3
          },
          showComments:false,
          showMsg:false,
        }

      }
    },
    computed: {
      ...mapGetters([
        'handleRequest',
      ]),
      sysTypeParam() {
        return {appType: this.bindData.appType}
      },
      FlowActions() {
        if (!this.handleRequest) return []
        let actions = []
        let createUser = this.handleRequest.createUser.split("/")[1], handler = this._getHandler(this.handleRequest.handler)
        let userName = getUserInfo().user.userName, toUser = getUserInfo().toUser, role = getUserInfo().user.role

        // 是否可编辑 状态为被驳回，处理人、创建者、指派人为当前用户
        this.isEdit = !(this.status == 2 && (handler.indexOf(userName) !=-1 || createUser == userName || (toUser && toUser.split(",").indexOf(createUser) != -1)))

        if (this.status == 0) {// 未处理
          if (createUser == userName || (toUser && toUser.split(",").indexOf(createUser) != -1)) {
            actions = [{TypeId: 5, FlowActionName: "取消请求", id: this.$route.query.id}]
          } else if (role == 5) {
            actions = [
              {TypeId: 4, FlowActionName: "驳回", id: this.$route.query.id},
              {TypeId: 3, FlowActionName: "转派", id: this.$route.query.id},
              {TypeId: 7, FlowActionName: "关单", id: this.$route.query.id},
            ]
          } else {
            actions = []
          }
        } else if (this.status == 1) { // 处理中
          if (handler.indexOf(userName) !=-1 || (toUser && this._handlerInToUser(toUser, handler))) {
            actions = [
              {TypeId: 3, FlowActionName: "转派", id: this.$route.query.id},
              {TypeId: 7, FlowActionName: "关单", id: this.$route.query.id},
            ]
          } else {
            // edti 不可编辑
          }
        } else if (this.status == 2) {  // 被驳回
          if (createUser == userName || (toUser && toUser.split(",").indexOf(createUser) != -1)) {
            actions = [
              {TypeId: 5, FlowActionName: "取消请求", id: this.$route.query.id},
              {TypeId: 1, FlowActionName: "再次提交", params: {status: 0, id: this.$route.query.id}, id: this.$route.query.id},
            ]
          } else {
            // edti 不可编辑
          }
        } else if (this.status == 3) { // 待评价
          if (createUser == userName || (toUser && toUser.split(",").indexOf(createUser) != -1)) {
            actions = [{TypeId: 8, FlowActionName: "提交评价", id: this.$route.query.id}]
          } else {
            // edti 不可编辑
          }
        } else { // status == 4 || status == 99 || status == 100
          // edti 不可编辑
          actions = []
        }
        this.tabObj.showComments= false
        this.tabObj.showMsg= false
        if(this.status != 3 && (actions.length!=0 || ( actions.length == 1 && actions[0].TypeId!= 8 ))) {
          this.tabObj.showComments= true
          this.tabObj.showMsg= true
        }
        return actions
      },
      /**
       * 评价相关
       *
       */
      evaluateObj(){
        if (!this.handleRequest) return {isShow : false, isEvaluate: false}
        let toUser = getUserInfo().toUser, createUser = this.handleRequest.createUser.split("/")[1]
        let isShow = this.status == 99
        let isEvaluate = (createUser == getUserInfo().user.userName || (toUser && toUser.split(",").indexOf(createUser) != -1)) && this.status == 3
        return {isShow : isShow, isEvaluate: isEvaluate}
      }
    },
    created() {
      this._initRequest()
    },
    methods: {
      ...mapMutations({
        setHandleRequest: 'SET_HANDLE_REQUEST',
      }),
      footerEvent(action) {
        if(action.TypeId == 8){
          let evaluate = this.$refs.evaluateWrapper.getEvaluate()
          if(!evaluate) return
          action.params = {evaluate: evaluate.evaluate, cacsi: evaluate.cacsi.key}
        }else {
          if(this.$refs.tabspan.getOpinionVal() == ''){
            this.$vux.toast.text("请填写处理意见", "bottom")
            return
          }else {
            this.bindData.opinion = this.$refs.tabspan.getOpinionVal()
          }
        }
        this.submitEvent(action)
      },
      _initRequest() {
        if (this.handleRequest) {
          for (var k in this.bindData) {
            this.bindData[k] = this.handleRequest[k]
          }
          this.serial = this.handleRequest.serial
          this.createTime = new Date(this.handleRequest.createTime.time).format("yyyy-MM-dd hh:mm:ss")
          this.createUser = this.handleRequest.createUser
          this.handler = this.handleRequest.handler
          this.cacsi = this.getCacsi(this.handleRequest.cacsi)
          this.status = this.handleRequest.status
          this.evaluate = this.handleRequest.evaluate
          this.tabObj.paramsMsg.refId =this.handleRequest.id
        } else {
          this.$router.replace('/serviceRequest')
        }
      },
      _getHandler(handler){
        let handlers = handler.split(","), h = []
        for(let k of handlers){
          h.push(k.split("/")[1])
        }
        return h
      },
      _handlerInToUser(toUser, handlers){
        // toUser.split(",").indexOf(handler) != -1)
        let mark = false
        for(let k of handlers){
          if(toUser.split(",").indexOf(k) != -1){
            mark = true
            break
          }
        }
        return mark
      }
    },
    components: {
      commFooter,
      appSelect,
      TabsPan,
      EvaluateWrapper,

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
    bottom: 0px;
  }

</style>
