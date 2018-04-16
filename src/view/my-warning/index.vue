<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">处理人工报障</x-header>
      <div class="wrapper-content">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">
          <x-input title="报障标题" placeholder="请输入文字" v-model="bindData.name"></x-input>
          <x-textarea title="报障内容" v-model="bindData.summary" placeholder="请输入文字" :show-counter="false" :rows="5"
                      :max="200"></x-textarea>
          <div class="hr"></div>
          <div class="hz-cell">
            <span class="label c4">状态</span>
            <span :class="getStatusType(status).class">{{getStatusType(status).title}}</span>
          </div>
          <div class="hr"></div>
          <app-select :url="sysTypeTypeUrl" title="系统分类" v-model="bindData.appType" :search="true"></app-select>
          <div class="hr"></div>
          <app-select title="所属系统" :url="sysTypeNameUrl" v-model="bindData.appName" :search="true" :param="sysTypeParam"
                      :isFirstRequest="false"></app-select>
          <x-input title="报障编号" :readonly="true" placeholder="请输入文字" v-model="serial"></x-input>
          <x-input title="报障时间" :readonly="true" v-model="bindData.faultTime"></x-input>
          <x-input title="提交时间" :readonly="true" v-model="createTime"></x-input>
          <x-input title="提交人" :readonly="true" v-model="createUser"></x-input>
          <x-input title="满意度" :readonly="true" v-model="cacsi"></x-input>
          <x-input title="处理评价" :readonly="true" v-model="evaluate"></x-input>
          <div class="hr"></div>
          <tabs-pan :id="rowId"></tabs-pan>
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
        rowId:this.$route.query.id,
        serial: '',    // 请求编号
        createTime: '',// 提交时间
        createUser: '', // 提交人
        cacsi: '',      // 满意度
        evaluate: '',   // 处理评价
        status: '',       // 状态
        bindData: {
          name: '',       // 标题
          summary: '',   // 内容
          faultTime: '', //报障时间
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
        'handleWarning',
      ]),
      sysTypeParam() {
        return {appType: this.bindData.appType}
      },
      FlowActions(){
        if(!this.handleWarning) return []
        let actions = []
        let createUser = this.handleWarning.createUser.split("/")[1], handler = this.handleWarning.handler.split("/")[1];
        let userName = getUserInfo().user.userName, toUser = getUserInfo().toUser, role = getUserInfo().user.role
        if(this.status == 0){// 未处理
          if(createUser == userName || (toUser && toUser.split(",").indexOf(createUser) != -1)){
            actions = [
              {TypeId: 16, FlowActionName: "取消", id: this.$route.query.id},
            ]
          }else{
            actions = []
          }
        }else if(this.status == 1) { // 处理中
          if(handler == userName || (toUser && toUser.split(",").indexOf(handler) != -1)){
            actions = [
              {TypeId: 14, FlowActionName: "转派", id: this.$route.query.id},
              {TypeId: 18, FlowActionName: "关闭", id: this.$route.query.id},
            ]
          }else{
            // edti 不可编辑
          }
        }else if(this.status == 2) {  // 被驳回
          if(createUser == userName || (toUser && toUser.split(",").indexOf(createUser) != -1)){
            actions = [
              {TypeId: 16, FlowActionName: "取消", id: this.$route.query.id},
              {TypeId: 12, FlowActionName: "再次提交", id: this.$route.query.id},
            ]
          }else{
            // edti 不可编辑
          }
        }else if(this.status == 3){ // 待评价
          if(createUser == userName || (toUser && toUser.split(",").indexOf(createUser) != -1)){
            actions = [
              {TypeId: 19, FlowActionName: "提交评价", id: this.$route.query.id},
              {TypeId: 12, FlowActionName: "再次提交", id: this.$route.query.id},
            ]
          }else{
            // edti 不可编辑
          }
        }else{ // status == 4 || status == 99 || status == 100
          // edti 不可编辑
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
            this.status = this.handleWarning.status
            this.evaluate = this.handleWarning.evaluate
        }else {
          this.$router.replace('/faultsWarning')
        }
      }
    },
    components: {
      commFooter,
      appSelect,
      tabsPan,

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
</style>
