<template>
  <transition name="move">
    <div class="test-wrapper ">
      <x-header :left-options="{backText: ''}">公告通知</x-header>

      <group title="请求方式">
        <cell title="get" is-link @click.native="get"></cell>
        <cell title="post" is-link @click.native="post"></cell>
      </group>
      <tabs id="GMED5V3LZY2FGP0G"></tabs>
    </div>
  </transition>

</template>

<script>

  import {XHeader,Group, Cell} from 'vux'
  import request from 'common/js/request'
  import Tabspan from 'components/tabs-pan/tabs-pan'

  export default {
    name: "test",
    data() {
      return {}
    },
    created() {
      setTimeout(() => {

      }, 20)
    },
    methods: {
      get(){
          request.post("http://192.168.1.100/ems/users/login",{userName:"admin",passWord:1}).then((data) => {
            alert(JSON.stringify("get==="+JSON.stringify(data)))
          }, (error) => {
            console.log(JSON.stringify("error==="+error))
          })
      },
      post(){
        request.post("https://bird.ioliu.cn/ip",{}).then((data) => {
          alert(JSON.stringify("post==="+JSON.stringify(data)))
        }, (error) => {
          console.log(JSON.stringify("error==="+error))
        })
      }
    },
    components: {
      XHeader,
      Group,
      Cell,
      'tabs':Tabspan
    }
  }
</script>

<style scoped>
  .test-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 22;
    background: #fff;
    overflow-y: auto;
  }
</style>
