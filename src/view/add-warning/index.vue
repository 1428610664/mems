<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">添加报障</x-header>
      <div class="wrapper-content">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">

          <app-select :url="sysTypeTypeUrl" title="系统分类" v-model="bindData.appType"></app-select>
          <div class="hr"></div>
          <app-select title="所属系统" :url="sysTypeNameUrl" v-model="bindData.appName" :param="sysTypeParam" :isFirstRequest="false"></app-select>

          <datetime v-model="bindData.faultTime" format="YYYY-MM-DD HH:mm" title="发生时间"></datetime>
          <x-input title="标题" placeholder="请输入文字" v-model="bindData.name"></x-input>
          <x-textarea title="内容" v-model="bindData.summary" placeholder="请输入文字" :show-counter="false" :rows="5"
                      :max="200"></x-textarea>
        </group>
      </div>

      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Group, Datetime, XTextarea, XInput, Selector} from 'vux'
  import commFooter from 'components/comm-footer'
  import appSelect from 'components/multi-select/app-select'
  import {getUrl} from 'common/js/Urls'
  import { addRequestMixin } from "common/mixin/eventMixin"
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "index",
    mixins: [addRequestMixin],
    data() {
      return {
        sysTypeTypeUrl: getUrl("appType"),
        sysTypeNameUrl: getUrl("appName"),

        mark: false,

        bindData: {
          name: '',       // 标题
          summary: '',   // 内容
          faultTime:'',        //时间
          appType: '',   // 系统分类
          appName: ''    // 所属系统
        },
        checkData: {
          name: {message: "请输入标题", check: "isEmpty"},
          summary: {message: "请输入内容", check: "isEmpty"},
          appType: {message: "请选择系统分类", check: "isEmpty"},
          appName: {message: "请选择所属系统", check: "isEmpty"},
        },
      }
    },
    created() {
      setTimeout(() => {
        if(this.$route.query.id && this.setTemporaryWarning){
          this.bindData.name = this.setTemporaryWarning.name
          this.bindData.summary = this.setTemporaryWarning.summary
          this.bindData.faultTime = this.setTemporaryWarning.faultTime
          this.bindData.appType = this.setTemporaryWarning.appType
          this.bindData.appName = this.setTemporaryWarning.appName
        }else{
          this.setTemporaryWarning(null)
        }
      }, 20)
    },
    computed: {
      ...mapGetters([
        'temporaryWarning',
      ]),
      sysTypeParam(){
        return {appType: this.bindData.appType}
      },
      FlowActions(){
        let actions = [
          {TypeId: 12, FlowActionName: "提交", params: {status: 0}},
          {TypeId: 13, FlowActionName: "暂存", params: {status: 100}}
        ]
        if(this.$route.query.id){
          actions = [
            {TypeId: 12, FlowActionName: "提交", params: {status: 0, id: this.$route.query.id}},
            {TypeId: 13, FlowActionName: "暂存", params: {status: 100, id: this.$route.query.id}},
            {TypeId: 17, FlowActionName: "删除", params: {status: 100}, id: this.$route.query.id, type: "delete"}
          ]
        }
        return actions
      }
    },
    methods: {
      ...mapMutations({
        setTemporaryWarning: 'SET_TEMPORARY_WARNING',
      }),
      footerEvent(action) {
        this.submitEvent(action)
      }
    },
    components: {
      commFooter,
      appSelect,

      XHeader,
      Group,
      Datetime,
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

</style>
