<template>
  <div class="item-wrapper-blue" @click="onItemClick">
    <div class="flex-box">
      <div class="title ct c3">标题：</div>
      <div class="desc hzline2">{{row.name}}</div>
    </div>
    <div class="flex-box mt">
      <div class="title ct c3">时间：</div>
      <div class="desc">
        <span class="c4">{{new Date(row.sendTime.time).format("yyyy-MM-dd hh:mm:ss")}}</span>
        <span class="status-success fr">处理中</span>
      </div>
    </div>
    <i class="number fz12 c" v-if="row.counts != 0? true: false ">{{row.counts > 99? "99+": row.counts}}</i>
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
