<template>
  <div class="item-wrapper-blue" @click="onItemClick">
    <div class="flex-box">
      <div class="title ct c3">标题：</div>
      <div class="desc">大打击到加上吉萨吉萨加上我家具撒我祭扫秒杀价哦你按季度哦年的假的骄傲你骄傲你剪刀手骄傲你的骄傲你</div>
    </div>
    <div class="flex-box mt">
      <div class="title ct c3">时间：</div>
      <div class="desc">
        <span class="c4">2017-12-12 12:12:12</span>
        <span class="status-success fr">处理中</span>
      </div>
    </div>
    <i class="number fz12 c">5</i>
  </div>
</template>

<script>
  export default {
    name: "item-wrapper",
    props: {
      row: Object
    },
    data(){
      return {}
    },
    created(){
      setTimeout(() => {

      }, 20)
    },
    methods: {
      onItemClick(){
        this.$emit("onClick",this.row)
      }
    }
  }
</script>

<style scoped>
  .number {
    font-style: normal;
    position: absolute;
    top: -7px;
    right: -7px;
    background: red;
    padding: 1px 7px;
    line-height: 18px;
    border-radius: 20px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
  }

  .flex-box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    line-height: 20px;
  }

  .title {
    -webkit-flex: 0 0 40px;
    -ms-flex: 0 0 40px;
    flex: 0 0 40px;
  }

  .desc {
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }

</style>
