<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">添加请求</x-header>
      <div class="wrapper-content">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">

          <app-select :url="sysTypeTypeUrl" title="系统分类" v-model="bindData.appType"></app-select>
          <div class="hr"></div>
          <app-select title="所属系统" :url="sysTypeNameUrl" v-model="bindData.appName" :param="sysTypeParam" :isFirstRequest="false"></app-select>

          <selector v-model="bindData.type" title="是否查数" :options="checkNumberArray"></selector>
          <x-input title="标题" placeholder="请输入文字" v-model="bindData.name"></x-input>
          <x-textarea title="描述" v-model="bindData.summary" placeholder="请输入文字" :show-counter="false" :rows="5"
                      :max="200"></x-textarea>
        </group>
      </div>

      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Group, XTextarea, XInput, Selector} from 'vux'
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
      }
    },
    created() {
      setTimeout(() => {
        if(this.$route.query.id && this.temporaryRequest){
          this.bindData.name = this.temporaryRequest.name
          this.bindData.summary = this.temporaryRequest.summary
          this.bindData.type = this.temporaryRequest.type
          this.bindData.appType = this.temporaryRequest.appType
          this.bindData.appName = this.temporaryRequest.appName
        }else{
          this.setTemporaryRequest(null)
        }
      }, 20)
    },
    computed: {
      ...mapGetters([
        'temporaryRequest',
      ]),
      sysTypeParam(){
        return {appType: this.bindData.appType}
      },
      FlowActions(){
        let actions = [
          {TypeId: 1, FlowActionName: "提交", params: {status: 0}},
          {TypeId: 2, FlowActionName: "暂存", params: {status: 100}}
        ]
        if(this.$route.query.id){
          actions = [
            {TypeId: 1, FlowActionName: "提交", params: {status: 0, id: this.$route.query.id}},
            {TypeId: 2, FlowActionName: "暂存", params: {status: 100, id: this.$route.query.id}},
            {TypeId: 6, FlowActionName: "删除", params: {status: 100}, id: this.$route.query.id, type: "delete"}
          ]
        }
        return actions
      }
    },
    methods: {
      ...mapMutations({
        setTemporaryRequest: 'SET_TEMPORARY_REQUEST',
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
