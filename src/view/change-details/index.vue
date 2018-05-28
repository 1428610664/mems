<template>

  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">变更详情</x-header>
      <div class="wrapper-content" :class="FlowActions.length ? '' : 'bom'">
        <group label-width="5em" label-margin-right="2em" label-align="right">

          <x-input title="变更名称" :readonly="true" v-model="bindData.name"></x-input>
          <x-textarea title="描述"  :readonly="true" v-model="bindData.descs" :show-counter="false" :rows="1" autosize></x-textarea>
          <x-input title="变更单号" :readonly="true" v-model="bindData.id"></x-input>
          <div class="hr"></div>
          <div class="hz-cell"><span class="label c4">状态</span><span :class="getStateType(bindData.status).class">{{getStateType(bindData.status).title}}</span></div>
          <x-input title="创建时间" :readonly="true" v-model="bindData.createTime"></x-input>
          <x-input title="创建人" :readonly="true" v-model="bindData.createUser"></x-input>
          <x-input title="变更开始时间" :readonly="true" v-model="bindData.beginTime"></x-input>
          <x-input title="变更结束时间" :readonly="true" v-model="bindData.endTime"></x-input>
          <x-input title="实际结束时间" :readonly="true" v-model="bindData.actualTime"></x-input>
          <x-input title="变更结果" :readonly="true" v-model="bindData.result"></x-input>
          <x-textarea title="变更结果备注"  :readonly="true" v-model="bindData.remark" :show-counter="false" :rows="1" autosize></x-textarea>
        </group>

        <div>
          <div class="cell-title c4 fz14">变更范围</div>
          <div v-if="rule.ip" class="fz14" style="padding: 10px 15px">ip地址：{{rule.ip}}</div>
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
  import {getUserInfo} from 'common/js/cache'

  export default {
    name: "index",
    mixins: [maintainMixin],
    data() {
      return {
        // 维护期规则
        rule: {
          appTree: [],            // 应用系统
          ip: [],                  // ip地址
        },
        bindData: {
          name: '',             // 变更名称
          descs: '',             // 内容
          id: '',               // 单号
          status: '',           // 状态
          createTime: '',      // 创建时间
          createUser: '',      // 创建人
          beginTime: '',       // 变更开始时间
          endTime: '',         // 变更结束时间
          actualTime: '',      // 实际结束时间
          result: '',           // 变更结果
          remark: '',           // 变更备注
        }
      }
    },
    computed: {
      ...mapGetters([
        'change',
      ]),
      FlowActions() {
        let actions = []
        // 校验创建者是否是当前用户 或 toUser里包含创建者
        let createUser = this.change.createUser.split("/")[1], userName = getUserInfo().user.userName, toUser = getUserInfo().toUser
        console.log(createUser +"------------"+ userName)
        if(createUser != userName || (toUser && toUser.split(",").indexOf(createUser) == -1)){
          return []
        }

        if (this.bindData.status == 0) {
          actions = [// 修改、删除、禁用
            {TypeId: -1, FlowActionName: "修改", id: this.$route.query.id},
            {TypeId: 51, FlowActionName: "删除", id: this.$route.query.id, type: "delete"},
          ]
        }else if(this.bindData.status == 1){
          actions = [
            {TypeId: -2, FlowActionName: "结束"}
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
          this.$router.replace({path: "/addChange",query:{id: this.$route.query.id}})
          return
        }else if(action.TypeId == -2){ // 跳至确认页
          this.$router.replace({path: "/changnEnd",query:{id: this.$route.query.id}})
          return
        }
        this.submitEvent(action)
      },
      init() {
        if(!this.change || !this.$route.query.id){
          history.go(-1)
          return
        }

        // 基本数据赋值
        let arr = ["createTime", "beginTime", "endTime", "actualTime"]
        for (let k in this.bindData) {
          if(arr.indexOf(k) > -1){
            if(this.change[k]) this.bindData[k] = new Date(this.change[k].time).format("yyyy-MM-dd hh:mm:ss")
          }else{
            this.bindData[k] = this.change[k]
          }
        }
        // 维护期规则赋值
        this._paseRule(JSON.parse(this.change.rule))
      },
      /**
       * 解析维护期规则
       * @param rule
       * @private
       */
      _paseRule(rule){
        this.rule.appTree = SysAppUtils.getTreeDate(rule.app)

        let ips = []
        for(let k of rule.ip){
          ips.push(k.ip)
        }
        this.rule.ip = ips.join(",")
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
