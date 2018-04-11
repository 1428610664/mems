<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">处理服务请求</x-header>
      <div class="wrapper-content">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">
          <x-input title="请求标题" placeholder="请输入文字" v-model="bindData.name"></x-input>
          <x-textarea title="请求描述" v-model="bindData.summary" placeholder="请输入文字" :show-counter="false" :rows="5"
                      :max="200"></x-textarea>
          <x-input title="请求编号" placeholder="请输入文字" v-model="bindData.Nunber"></x-input>
          <selector v-model="bindData.type" title="是否查数" :options="checkNumberArray"></selector>
          <div class="hr"></div>
          <app-select :url="sysTypeTypeUrl" title="系统分类" v-model="bindData.appType"></app-select>
          <div class="hr"></div>
          <app-select title="所属系统" :url="sysTypeNameUrl" v-model="bindData.appName" :param="sysTypeParam" :isFirstRequest="false"></app-select>

          <x-input title="提价时间" v-model="bindData.name"></x-input>
          <x-input title="提交人" v-model="bindData.name"></x-input>
          <x-input title="满意度" v-model="bindData.name"></x-input>
          <x-input title="处理评价" v-model="bindData.name"></x-input>

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
  import { eventMixin } from "common/mixin/eventMixin"

  export default {
    name: "index",
    mixins: [eventMixin],
    data() {
      return {
        sysTypeTypeUrl: getUrl("appType"),
        sysTypeNameUrl: getUrl("appName"),

        bindData: {
          name: '',       // 标题
          summary: '',   // 内容
          Nunber: '',
          type: '否',    // 是否查数
          appType: '',   // 系统分类
          appName: ''    // 所属系统
        },
        checkData: {
          name: {message: "请输入标题", check: "isEmpty"},
          summary: {message: "请输入描述", check: "isEmpty"},
          appType: {message: "请选择系统分类", check: "isEmpty"},
          appName: {message: "请选择所属系统", check: "isEmpty"},
        },

        checkNumberArray: ["是", "否"],
        FlowActions: [
          {TypeId: 1, FlowActionName: "提交"},
          {TypeId: 2, FlowActionName: "暂存"}
        ]
      }
    },
    computed: {
      sysTypeParam(){
        return {appType: this.bindData.appType}
      }
    },
    created() {
      setTimeout(() => {

      }, 20)
    },
    methods: {
      footerEvent(typeId) {
        this.submitEvent(typeId)
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

  .wrapper-content{
    position: absolute;
    top: 46px;
    bottom: 45px;
    overflow: auto;
    width: 100%;
  }
</style>
