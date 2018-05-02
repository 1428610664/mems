<template>

  <div class="table-wrapper fz14">
    <div class="table-item" v-for="item in 5">
      <div class=""><span class="circle"></span>极高</div>
      <div class="ct">1200</div>
      <div class="ct">45%</div>
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

  .table-wrapper {
    padding: 8px 10%;
  }

  .table-item {
    display: flex;
    line-height: 34px;
  }

  .table-item:nth-child(n+2) {
    border-top: 1px solid #ddd;
  }

  .table-item > div {
    flex: 1;
  }

  .circle{
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 5px;
    vertical-align: middle;
    border-radius: 20px;
    background: red;
  }

</style>
