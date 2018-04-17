<template>
  <transition name="move">
    <div class="seting-wrapper b">
      <x-header :left-options="{backText: ''}">设置</x-header>

      <div class="wrapper-content">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">
          <x-input title="账号" v-model="bindData.userName"></x-input>
          <x-input title="名称" v-model="bindData.name"></x-input>
          <x-input title="手机" v-model="bindData.mobilePhone"></x-input>
          <x-input title="固定电话" v-model="bindData.tel"></x-input>
          <selector v-model="bindData.type" :readonly="true" title="状态" :options="checkNumberArray"></selector>
          <x-input title="部门" v-model="bindData.depart"></x-input>
          <x-input title="微信" v-model="bindData.wechat"></x-input>
          <x-input title="email" v-model="bindData.email"></x-input>
          <x-textarea title="备注" v-model="bindData.memo" placeholder="请输入..." :show-counter="false" :rows="5" :max="200"></x-textarea>
        </group>
      </div>
      <comm-footer :FlowActions="acitons" @event="footerEvent"></comm-footer>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Group, XTextarea, XInput, Selector} from 'vux'
  import commFooter from 'components/comm-footer'
  import {getUserInfo} from 'common/js/cache'
  import request from 'common/js/request'
  import {getUrl} from 'common/js/Urls'

  export default {
    name: "index",
    data() {
      return {
        bindData: {
          userName: '',        // 账号
          name: '',            // 名称
          mobilePhone: '',    // 手机
          tel: '',             // 电话
          type: '',            // 状态
          depart: '',         // 部门
          wechat: '',         // 微信
          email: '',          // 邮箱
          memo: '',           // 备注
        },

        checkNumberArray: [{key: "1", value: '可用'}, {key: "0", value: '不可用'}],
        acitons:[
          {TypeId: 1, FlowActionName: "保存"},
          {TypeId: 0, FlowActionName: "取消"}
        ]
      }
    },
    created() {
        this.init()
    },
    methods: {
      init(){
        for(var k in this.bindData){
          this.bindData[k] = getUserInfo().user[k]
        }
      },
      footerEvent(action){
        if(action.TypeId == 0){
          history.go(-1)
          return
        }
        console.log(JSON.stringify(this.bindData))
        this.$vux.loading.show({text: '数据提交中...'})
        request.post(getUrl("users"), Object.assign({}, {id: getUserInfo().user.id}, this.bindData)).then(res => {
          this.$vux.loading.hide()
          this.$vux.toast.text(res.desc, "bottom")
        }, error => {
          this.$vux.loading.hide()
        })
      }
    },
    components: {
      XHeader,
      Group,
      XTextarea,
      XInput,
      Selector,

      commFooter
    }
  }
</script>

<style scoped>

  .seting-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 22;
    overflow-y: auto;
  }

  .wrapper-content {
    position: absolute;
    top: 46px;
    bottom: 45px;
    left: 0;
    overflow-y: auto;
    width: 100%;
  }

</style>
