<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">修改密码</x-header>

      <div class="wrapper-content">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">
          <x-input title="原密码" type="password" v-model="originalPsw"></x-input>
          <x-input title="密码" type="password" v-model="bindData.passWord"></x-input>
          <x-input title="确认密码" type="password" v-model="confirmPsw"></x-input>
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
        originalPsw: '',    // 账号
        confirmPsw: '',     // 手机
        bindData: {
          passWord: '',     // 名称
        },

        acitons:[
          {TypeId: 1, FlowActionName: "修改"},
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
      XInput,

      commFooter
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
    z-index: 22;
    overflow-y: auto;
  }

  .wrapper-content {
    position: absolute;
    top: 46px;
    bottom: 45px;
    overflow: auto;
    width: 100%;
  }

</style>
