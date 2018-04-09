<template>

  <div>
    <loading v-if="state == 2"></loading>

    <error v-if="state == 3 && mark == false"></error>
    <div class="loaded" style="padding: 12px 0;" v-if="state == 3 && mark == true"><i
      class="iconfont icon-shibai fz20"></i>&nbsp;&nbsp;加载失败...
    </div>

    <not-result v-if="state == 4 && mark == false"></not-result>
    <div class="loaded" v-if="state == 1 && mark == true">- 已加载完毕 -</div>
  </div>

</template>

<script>

  import Loading from 'components/loading/loading'
  import NotResult from 'components/not-result/not-result'
  import Error from 'components/error/error'

  export default {
    props: {
      // 1：加载完毕,  2：加载中, 3：加载失败, 4：没数据
      state: {
        type: Number,
        default: 0
      },
      mark: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Loading,
      NotResult,
      Error
    }
  }


</script>

<style>
</style>
