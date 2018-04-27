<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">关单</x-header>
      <div class="wrapper-content">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">
          <div class="hr"></div>
          <div class="hz-cell">
            <div class="weui-cell__hd">
                <span class="label c4 in-line">转问询</span>
            </div>
            <div class="weui-cell__bd">
              <checker v-model="bindData.inquuire" radio-required default-item-class="radio_item" selected-item-class="radio_selected">
                <checker-item value="1">否</checker-item>
                <checker-item value="2">是</checker-item>
              </checker>
            </div>
          </div>
          <div v-show=" bindData.inquuire=='1' ">
            <div class="hr"></div>
            <app-select :url="rootCauseUrl" title="事件根本原因" v-model="bindData.rootCause" :search="true" :param="rootCauseParam" field="valueRule" size="5"></app-select>
            <datetime v-model="bindData.closeTime" format="YYYY-MM-DD HH:mm:ss" title="事件结束时间"></datetime>
            <div class="hr"></div>
            <div class="hz-cell">
              <div class="weui-cell__hd">
                <span class="label c4 in-line">事件标记</span>
              </div>
              <div class="weui-cell__bd">
                <checker v-model="bindData.sign" :max="3" type="radio_item" default-item-class="check_item" selected-item-class="check_selected">
                  <checker-item value="isTrun">转问题</checker-item>
                  <checker-item value="knowledge">进知识库</checker-item>
                  <checker-item value="daily">进日报</checker-item>
                </checker>
              </div>
            </div>
            <x-textarea title="事件原因" v-model="bindData.eventCause" placeholder="请输入原因" :show-counter="false" :rows="3"
                        :max="100"></x-textarea>
            <x-textarea title="事件处理过程" v-model="bindData.process" placeholder="请输入处理过程" :show-counter="false" :rows="3"
                        :max="100"></x-textarea>

          </div>
        </group>
      </div>

      <comm-footer :FlowActions="FlowActions" @event="footerEvent"></comm-footer>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Group, XTextarea, XInput, Selector ,CheckIcon , Checker, CheckerItem} from 'vux'
  import commFooter from 'components/comm-footer'
  import appSelect from 'components/multi-select/app-select'
  import datetime from 'components/datetime/index'
  import {getUrl} from 'common/js/Urls'
  import request from 'common/js/request'
  import utils from 'common/js/utils'
  import {actionJson} from 'api/commonEvent'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "index",
    data() {
      return {
        rootCauseUrl: getUrl("obtainConfig"),
        mark: false,

        bindData: {
          inquuire: '1', //转问询
          rootCause: '',  //事件根本原因
          closeTime: '',  //事件结束时间
          sign: [],       //事件标记
          eventCause: '', //事件原因
          process: ''  //事件处理过程
        },
        checkData: {
          rootCause: {message: "请选择事件根本原因", check: "isEmpty"},
          closeTime: {message: "请设置事件结束时间", check: "isEmpty"},
          eventCause: {message: "请填写事件原因", check: "isEmpty"},
          process: {message: "请填写事件处理过程", check: "isEmpty"}
        },
        select: {
          inquuire:[{key:'1',value:'是'},{key:"2",value:"否"}],
        }
      }
    },
    created() {
    },
    computed: {
      ...mapGetters([
        'handleEvents',
      ]),
      rootCauseParam () {
        return {cname: 'Event_Cause', sort: "cname",offset:0,limit:200}
      },
      FlowActions(){
        return [
          {TypeId: 1, FlowActionName: "确定", params: {status: 0}},
          {TypeId: 0, FlowActionName: "取消", params: {status: 100}}
        ]
      }
    },
    methods: {
      footerEvent(action) {
        let _params = {}
        if(this.bindData.inquuire == '1'){
          if(!this._checkData()) return

          _params.rootCause = this.bindData.rootCause
          _params.closeTime = this.bindData.closeTime
          _params.eventCause = this.bindData.eventCause
          _params.process = this.bindData.process
           this.bindData.sign.forEach((item)=>{
            _params[item] = '1'
          })
        }
        this.$vux.loading.show({text: '数据提交中...'})
        request.post(actionJson(this.bindData.inquuire == '2' ? 34 : 30, this.$route.query.id)[0], Object.assign({},_params)).then(res => {
          this.$vux.loading.hide()
          this.$vux.toast.text(res.desc, "bottom")
          if(res.success){
            this.$router.replace({path:"/home"});
          }
        }, error => {
          this.$vux.loading.hide()
        })
      },
      _checkData(){
        let mark = true
        for(var k in this.checkData){
          if(utils[this.checkData[k].check](this.bindData[k])){
            mark = false
            this.$vux.toast.text(this.checkData[k].message, "bottom")
            break
          }
        }
        return mark
      },
    },
    components: {
      commFooter,
      appSelect,
      datetime,

      XHeader,
      Group,
      XTextarea,
      XInput,
      Selector,
      CheckIcon,
      Checker,
      CheckerItem
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
  .radio_item {
    border: 1px solid #ccc;
    padding: 2px 15px;
  }
  .radio_selected {
    border: 1px solid red;
  }
  .check_item {
    height: 30px;
    border: 1px solid #ccc;
    display: inline-block;
    border-radius: 5%;
    line-height: 30px;
    text-align: center;
    padding: 0 5px;
  }
  .check_selected {
    border-color: red;
  }
</style>
