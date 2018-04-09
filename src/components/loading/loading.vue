<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif">
    <span v-show="layout">{{title}}</span>
    <p class="desc" v-show="!layout">{{title}}</p>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      },
      layout: {
      	type: Boolean,
      	default: false
      }
    }
  }
</script>
<style scoped>

.loading{width: 100%;text-align: center;font-size: 12px;color: #999;padding: 12px 0;}
.loading .desc{line-height: 20px;}
.loading img{vertical-align: middle;}
.loading span{margin-left: 10px;}

</style>
