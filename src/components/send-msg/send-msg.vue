<template>

  <div class="message-content b">
    <div class="ipu-wrapper posct">
      <textarea class="ipu" :class="messame.trim().length > 0 ? 'on': ''" v-model="messame" ref="messame"></textarea>
    </div>
    <div class="btn-wrapper posct">
      <button class="send b1 c fz14 btn-active" @click="send">发送</button>
    </div>
  </div>

</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        messame: ""
      }
    },
    created() {
    },
    methods: {
      send(){
        if(this.messame.trim().length == 0) {
          this.$vux.toast.text("请输入内容", "bottom")
          this.$refs.messame.focus()
          return
        }
        this.$emit("send", this.messame)
        this.$refs.messame.blur()
      },
      clearMsg(){
        this.messame = ''
      }
    }
  }
</script>

<style scoped>

  .message-content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }

  .ipu-wrapper {
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 50px;
  }

  .ipu-wrapper .ipu{
    width: calc( 98% - 12px );
    height: 24px;
    border: none;
    padding: 6px 6px;
    border-bottom: 1px solid #c1c1c1;
  }

  .ipu-wrapper .ipu.on{
    border-bottom: 1px solid #3D5C99;
  }

  .btn-wrapper {
    -webkit-flex: 0 0 60px;
    -ms-flex: 0 0 60px;
    flex: 0 0 60px;
    height: 50px;
  }

  .btn-wrapper .send{
    width: 80%;
    height: 36px;
    border: none;
    border-radius: 5px;
  }

</style>
