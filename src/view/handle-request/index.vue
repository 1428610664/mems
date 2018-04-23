<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">处理服务请求</x-header>
      <div class="wrapper-content" :class="FlowActions.length ? '' : 'bom'">
        <group label-width="5em" label-margin-right="2em" label-align="right">
          <x-input title="请求标题" :readonly="isEdit" placeholder="请输入文字" v-model="bindData.name"></x-input>
          <x-textarea title="请求描述" :readonly="isEdit" v-model="bindData.summary" placeholder="请输入文字"
                      :show-counter="false" :rows="5"
                      :max="200"></x-textarea>
          <x-input title="请求编号" :readonly="true" placeholder="请输入文字" v-model="serial"></x-input>
          <div class="hr"></div>
          <div class="hz-cell">
            <span class="label c4">状态</span>
            <span :class="getStatusType(status).class">{{getStatusType(status).title}}</span>
          </div>
          <selector v-model="bindData.type" :readonly="isEdit" title="是否查数" :options="checkNumberArray"></selector>
          <div class="hr"></div>
          <app-select :url="sysTypeTypeUrl" :readonly="isEdit" title="系统分类" v-model="bindData.appType"></app-select>
          <div class="hr"></div>
          <app-select title="所属系统" :readonly="isEdit" :url="sysTypeNameUrl" v-model="bindData.appName"
                      :param="sysTypeParam"
                      ></app-select>
          <x-input title="提交时间" :readonly="true" v-model="createTime"></x-input>
          <x-input title="当前处理人" :readonly="true" v-model="handler"></x-input>
          <x-input title="提交人" :readonly="true" v-model="createUser"></x-input>
          <x-input title="满意度" :readonly="true" v-model="cacsi"></x-input>
          <x-input title="处理评价" :readonly="true" v-model="evaluate"></x-input>

          <div class="hr"></div>
          <tabs-pan :id="rowId" :opinionUrl="opinionUrl"></tabs-pan>
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
        checkNumberArray: [{key: "1", value: '是'}, {key: "2", value: '否'}]
      }
    },
    computed: {
      ...mapGetters([
        'handleRequest',
      ]),
      sysTypeParam() {
        return {appType: this.bindData.appType}
      },
      // 是否不可编辑
      /*isEdit() {
        let handler = this.handleRequest.handler.split("/")[1]
        return this.status == 2 && handler == getUserInfo().user.userName ? false : true
      },*/
      FlowActions() {
        if (!this.handleRequest) return []
        let actions = []
        let createUser = this.handleRequest.createUser.split("/")[1], handler = this.handleRequest.handler.split("/")[1]
        let userName = getUserInfo().user.userName, toUser = getUserInfo().toUser, role = getUserInfo().user.role
        /*console.log("====getUserInfo()===" + JSON.stringify(getUserInfo()))
        console.log("createUser：" + createUser + "-----------------handler：" + handler)
        console.log("userName：" + userName + "-----------------toUser：" + toUser + "------------------role：" + role)
        console.log("-------handleRequest--------" + JSON.stringify(this.handleRequest))*/

        if(this.status == 2 && handler == userName){
          this.isEdit = false
        }else{
          this.isEdit = true
        }

        if (this.status == 0) {// 未处理
          if (createUser == userName || (toUser && toUser.split(",").indexOf(createUser) != -1)) {
            actions = [
              {TypeId: 5, FlowActionName: "取消", id: this.$route.query.id},
            ]
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
          if (handler == userName || (toUser && toUser.split(",").indexOf(handler) != -1)) {
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
              {
                TypeId: 1,
                FlowActionName: "再次提交",
                params: {status: 0, id: this.$route.query.id},
                id: this.$route.query.id
              },
            ]
          } else {
            // edti 不可编辑
          }
        } else if (this.status == 3) { // 待评价
          if (createUser == userName || (toUser && toUser.split(",").indexOf(createUser) != -1)) {
            actions = [
              {TypeId: 8, FlowActionName: "提交评价", id: this.$route.query.id},
              {
                TypeId: 11,
                FlowActionName: "再次提交",
                params: {status: 0, id: this.$route.query.id},
                id: this.$route.query.id
              },
            ]
          } else {
            // edti 不可编辑
          }
        } else { // status == 4 || status == 99 || status == 100
          // edti 不可编辑
          actions = []
        }
        return actions
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
        } else {
          this.$router.replace('/serviceRequest')
        }
      }
    },
    components: {
      commFooter,
      appSelect,
      TabsPan,

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
