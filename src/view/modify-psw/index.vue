<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">修改密码</x-header>

      <div class="wrapper-content">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">
          <x-input title="原密码" type="password" v-model="bindData.passWord"></x-input>
          <x-input title="新密码" type="password" v-model="bindData.newPassWord"></x-input>
          <x-input title="确认密码" type="password" v-model="bindData.confirmPsw"></x-input>
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
  import utils from 'common/js/utils'
  import {getUrl} from 'common/js/Urls'

  export default {
    name: "index",
    data() {
      return {
        bindData: {
          passWord: '',       // 原密码
          newPassWord: '',   // 密码
          confirmPsw: '',     // 确认密码
        },

        acitons:[
          {TypeId: 1, FlowActionName: "修改"},
          {TypeId: 0, FlowActionName: "取消"}
        ],
        checkData: {
          passWord: {message: "请输入原密码", check: "isEmpty"},
          newPassWord: {message: "请输入新密码", check: "isEmpty"},
          confirmPsw: {message: "请输入确认密码", check: "isEmpty"},
        }
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
        if(!this._checkData()) return
        if(this.bindData.newPassWord != this.bindData.confirmPsw){
          this.$vux.toast.text("新密码与确认密码不一致", "bottom")
          return
        }
        this.$vux.loading.show({text: '数据提交中...'})
        request.post(getUrl("updatePsw"), Object.assign({}, {userName: getUserInfo().user.userName}, this.bindData)).then(res => {
          this.$vux.loading.hide()
          this.$vux.toast.text(res.desc, "bottom")
          if(res.success) history.go(-1)
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
