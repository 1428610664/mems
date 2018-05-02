<template>

  <div>

    <div class="bar-txt-wrapper fz20">
      <div class="bar-txt">
        <span class="fz13 c3">未受理</span><br/>111
      </div>
      <div class="bar-txt">
        <span class="fz13 c3">已受理</span><br/>222
      </div>
      <div class="bar-txt">
        <span class="fz13 c3">已关闭</span><br/>333
      </div>
    </div>
    <div class="bar-wrapper">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>

  </div>

</template>

<script>
  export default {
    name: "index",
    data() {
      return {}
    },
    created() {
      setTimeout(() => {

      }, 20)
    },
    methods: {}
  }
</script>

<style scoped>

  .bar-txt-wrapper, .bar-wrapper{
    display: flex;
    padding: 0 20px;
  }

  .bar-txt,.bar{
    flex: 1;
    text-align: center;
  }

  .bar{
    height: 16px;
  }

  .bar-wrapper .bar:nth-child(1){
    background: red;
  }
  .bar-wrapper .bar:nth-child(2){
    background: green;
  }
  .bar-wrapper .bar:nth-child(3){
    background: yellow;
  }

</style>
