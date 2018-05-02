<template>

  <div class="tab-wrapper">

    <div class="tab-item c" @click="onTabClick(index)" :class="index == currentIndex ? 'b1' : 'b2'" v-for="(tab, index) in tabs" :key="index">
      {{tab}}
    </div>

  </div>

</template>

<script>
  export default {
    name: "index",
    props: {

    },
    data() {
      return {
        tabs: ["一天", "一周", "一月"],
        currentIndex: 0
      }
    },
    created() {
      setTimeout(() => {

      }, 20)
    },
    methods: {
      onTabClick( index ){
        this.currentIndex = index
        this.$emit("onTabClick", index)
      }
    }
  }
</script>

<style scoped>

  .tab-wrapper{
    display: flex;
    flex-direction: row-reverse;
    margin: 10px;
  }

  .tab-item{
    padding: 6px 15px;
    margin-left: 3px;
  }

</style>
