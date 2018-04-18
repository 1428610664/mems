<template>

  <div>
    <div v-transfer-dom>
      <popup v-model="dropDown" position="bottom" max-height="60%">
        <checklist :options="options" v-model="checkData" @on-change="change"></checklist>
      </popup>
    </div>
  </div>

</template>

<script>

  import {Checklist, TransferDom, Popup} from 'vux'

  export default {
    name: "index",
    props: {
      value: {
        type: String,
        default: ""
      },
      options: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        dropDown: false,
        checkData: this.value.indexOf("|") > -1 ? this.value.split("|") : []
      }
    },
    created() {
      setTimeout(() => {

      }, 20)
    },
    methods: {
      change(v){
        this.$emit('input', v.join("|"))
      },
      show(){
        this.dropDown = true
      }
    },
    directives: {
      TransferDom
    },
    components: {
      Checklist,
      Popup
    }
  }
</script>

<style scoped>

</style>
