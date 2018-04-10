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

  import {XHeader} from 'vux'
  import {Group, XTextarea, XInput, Selector} from 'vux'
  import commFooter from 'components/comm-footer'
  import appSelect from 'components/multi-select/app-select'
  import {getUrl} from 'common/js/Urls'
  import utils from 'common/js/utils'
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
          type: '否',    // 是否查数
          appType: '',   // 系统分类
          appName: ''    // 所属系统
        },
        checkNumberArray: ["是", "否"],
        FlowActions: [
          {TypeId: 1, FlowActionName: "提交"},
          {TypeId: 2, FlowActionName: "暂存"}
        ]
      }
    },
    created() {
      setTimeout(() => {

      }, 20)
    },
    computed: {
      sysTypeParam(){
        return {appType: this.bindData.appType}
      }
    },
    methods: {
      footerEvent(typeId) {
        if(utils.isEmpty(this.bindData.appType)){
          this.$vux.toast.text("请选择系统", "bottom")
          return
        }
        if(utils.isEmpty(this.bindData.appName)){
          this.$vux.toast.text("请选择所属系统", "bottom")
          return
        }
        if(utils.isEmpty(this.bindData.name)){
          this.$vux.toast.text("请填写标题", "bottom")
          return
        }if(utils.isEmpty(this.bindData.summary)){
          this.$vux.toast.text("请填写内容", "bottom")
          return
        }
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

  .hr {
    height: 1px;
    background: #D9D9D9;
    margin-left: 15px;
  }

</style>
