<template>

  <div>
    <footer class="" v-show="FlowActions != 0">
      <ul class="fbox fz16 c4">
        <li class="flex" @click="event(item.TypeId)" :data-id="item.TypeId" v-for="(item, index) in _filterActions(FlowActions, true)" v-if="item.TypeId != 18">{{item.FlowActionName}}</li>
        <li class="flex" @click="showMore" v-show="FlowActions.length > 4">更多</li>
      </ul>
    </footer>
    <div class="more-wrapper fz15 c4 b" :class="{hide: !isShowMore}">
      <ul>
        <li @click="event(item.TypeId, true)" v-if="item.TypeId != 18" :data-id="item.TypeId" v-for="(item, index) in _filterActions(FlowActions, false)">{{item.FlowActionName}}</li>
      </ul>
    </div>
    <div class="more-bg" :class="{hide: !isShowMore}" @click="hideMore"></div>
  </div>

</template>

<script>

  export default{
    props: {
      FlowActions: {
        type: Array,
        default: []
      }
    },
    data(){
      return {
        isShowMore: false
      }
    },
    methods: {
      event(id, mark){
        this.$emit("event", id, mark)
      },
      hideMore(){
        this.isShowMore = false
      },
      showMore(){
        this.isShowMore = true
      },
      _filterActions(t, mark){
        if(mark){
          let len = t.length
          if(len <= 4){
            return t
          }
          return t.slice(0, 3)
        }else{
          return t.slice(3)
        }
      }
    }
  }

</script>

<style scoped>

  footer{position: fixed;bottom: 0;left: 0;z-index: 10;width: 100%;height: 45px;line-height: 45px;background: #fbfbfb;}
  footer:before{content:"";width: 100%;height: 1px;background: #3D5C99;position: absolute;top: -1px;left: 0;transform: scaleY(.5);}
  footer .flex{position: relative;}
  footer .flex:active{background: #f0f0f0;}
  footer .flex:nth-child(n+2):before{content:"";width: 1px;height: 60%;background: #3D5C99;position: absolute;top: 20%;left: 0;transform: scaleX(.5);}

  .more-wrapper{position: fixed;bottom: 45px;right: 10px;z-index: 18;width: 110px;line-height: 45px;text-align: center;border-radius: 2px;box-shadow: 0 0 5px #ccc;max-height: 200px;overflow-y: auto;}
  .more-wrapper li:nth-child(n+2):before{content: "";display: block;border-top: 1px solid #ddd;transform: scaleY(.4);}
  .more-wrapper li:active{background: #f0f0f0;}
  .more-bg{position: fixed;top: 0;left: 0;z-index: 17;width: 100%;height: 100%;}

</style>
