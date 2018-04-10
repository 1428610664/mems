<template>
  <div class="search-box">
    <i class="iconfont icon-sousuo c3"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="iconfont icon-guanbi fz18"></i>
  </div>
</template>

<script>
  import utils from 'common/js/utils'
  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clear() {
        this.query = ''
      },
      setQuery(query) {
        this.query = query
      },
      blur() {
        this.$refs.query.blur()
      }
    },
    created() {
      this.$watch('query', utils.debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 200))
    }
  }
</script>

<style scoped>
  .search-box{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: #ebebeb;
    border-radius: 6px;
  }
  .icon-search{
    font-size: 24px;
    color: red
  }
  .box{
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: #ebebeb;
    font-size: 14px;
    border: none;
  }
  .icon-dismiss{
    font-size: 16px;
    color: #222;
  }
</style>
