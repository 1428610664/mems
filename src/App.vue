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

  export default {
    data() {
      return {
        title: "首页"
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
