<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">转授权</x-header>
      <turn-user :url="url" :role="role" :FlowActions="FlowActions" @actionEvent="actionEvent"></turn-user>
    </div>
  </transition>
</template>

<script>

  import {XHeader} from 'vux'
  import turnUser from 'components/turn-user'

  import request from 'common/js/request'
  import {actionJson} from 'api/commonEvent'
  import {getUrl} from 'common/js/Urls'
  import {getUserInfo} from 'common/js/cache'
  import {authorizeMixin} from 'common/mixin/authorizeMixin'
  import {mapMutations} from 'vuex'

  export default {
    name: "index",
    mixins: [authorizeMixin],
    data() {
      return {
        url: getUrl("users"),
        role: getUserInfo().user.role,
        FlowActions: [{TypeId: 1, FlowActionName: "授权"}, {TypeId: 0, FlowActionName: "取消"}]
      }
    },
    methods: {
      ...mapMutations({
        setAuthorize: 'SET_AUTHORIZE'
      }),
      actionEvent(action, userNames) {
        this.$vux.loading.show({text: '数据提交中...'})
        request.post(getUrl("authorize"), {toUser: userNames.join(",")}).then(res => {
          this.$vux.loading.hide()
          this.$vux.toast.text(res.desc, "bottom")
          if (res.success) {
            console.log(JSON.stringify(res))
            this.setAuthorize(res)
            //this.confirmAuthorize(res)
            this.$router.replace({path: "/home"})
          }
        }, error => {
          this.$vux.loading.hide()
        })
      }
    },
    components: {
      XHeader,

      turnUser
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

</style>
