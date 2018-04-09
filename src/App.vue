<template>
  <div id="app" @touchmove.prevent>
    <x-header :left-options="{backText: '', showBack: false}" :title="title"></x-header>
    <div class="content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <v-footer @change-title="check"></v-footer>
  </div>
</template>

<script>

  import {XHeader} from 'vux'
  import footer from 'components/footer/footer'

  const title = {home: "主页", message: "消息", me: "我"}

  export default {
    data() {
      return {
        title: this.$route.path.substring(1) ? title[this.$route.path.substring(1)]: "主页"
      }
    },
    components: {
      XHeader,
      'v-footer': footer
    },
    methods: {
      check(t) {
        this.title = t;
      }
    },
    created() {
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';

  body {
    background-color: #fbf9fe;
  }
</style>
