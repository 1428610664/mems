<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">转派</x-header>
      <turn-user :FlowActions="FlowActions" @actionEvent="actionEvent"></turn-user>
    </div>
  </transition>
</template>

<script>

  import {XHeader} from 'vux'
  import turnUser from 'components/turn-user'

  import request from 'common/js/request'
  import {actionJson} from 'api/commonEvent'
  import {getUrl} from 'common/js/Urls'

  export default {
    name: "index",
    data() {
      return {
        FlowActions: [{TypeId: 1, FlowActionName: "确认"},{TypeId: 0, FlowActionName: "取消"}]}
    },
    methods: {
      actionEvent(action, userNames){
        this.$vux.loading.show({text: '数据提交中...'})
        request.post(actionJson(this.$route.query.type == "request" ? 3 : 14, this.$route.query.id)[0], {users: userNames.join(",")}).then(res => {
          this.$vux.loading.hide()
          this.$vux.toast.text(res.desc, "bottom")
          if(res.success){
            this.$router.replace({path:"/home"});
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
    z-index: 60;
    overflow-y: auto;
  }

</style>
