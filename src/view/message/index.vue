<template>

  <div class="message-wrapper">
    <tab>
      <tab-item selected @on-item-click="onTabItemClick">进行中</tab-item>
      <tab-item @on-item-click="onTabItemClick">已结束</tab-item>
    </tab>
    <div class="search-box">
      <search-box @query="searchQuery" placeholder="搜索消息..."></search-box>
    </div>
    <div class="list-wrapper">
      <ul class="list">
        <li class="item-wrapper-blue">
          <div class="flex-box">
            <div class="title ct c3">标题：</div>
            <div class="desc">大打击到加上吉萨吉萨加上我家具撒我祭扫秒杀价哦你按季度哦年的假的骄傲你骄傲你剪刀手骄傲你的骄傲你</div>
          </div>
          <div class="flex-box mt">
            <div class="title ct c3">时间：</div>
            <div class="desc">
              <span class="c4">2017-12-12 12:12:12</span>
            </div>
          </div>
          <i class="number fz12 c">5</i>
        </li>
        <li class="item-wrapper-blue">
          <div class="flex-box">
            <div class="title ct c3">标题：</div>
            <div class="desc">大打击到加上吉萨吉萨加上我家具撒我祭扫秒杀价哦你按季度哦年的假的骄傲你骄傲你剪刀手骄傲你的骄傲你</div>
          </div>
          <div class="flex-box mt">
            <div class="title ct c3">时间：</div>
            <div class="desc">
              <span class="c4">2017-12-12 12:12:12</span>
            </div>
          </div>
          <i class="number fz12 c">5</i>
        </li>
        <li class="item-wrapper-red">
          <div class="flex-box">
            <div class="title ct c3">标题：</div>
            <div class="desc">大打击到加上吉萨吉萨加上我家具撒我祭扫秒杀价哦你按季度哦年的假的骄傲你骄傲你剪刀手骄傲你的骄傲你</div>
          </div>
          <div class="flex-box mt">
            <div class="title ct c3">时间：</div>
            <div class="desc">
              <span class="c4">2017-12-12 12:12:12</span>
            </div>
          </div>
          <i class="number fz12 c">5</i>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
  import SearchBox from 'components/search-box/search-box'
  import {Tab, TabItem} from 'vux'

  export default {
    data() {
      return {}
    },
    methods: {
      onTabItemClick(index) {
        this.$vux.toast.text(index + "", "bottom")
      },
      searchQuery(v){
        console.log("搜索："+v)
      }
    },
    components: {
      Tab,
      TabItem,
      SearchBox
    }
  }

</script>

<style scoped>

  .search-box{
    padding: 5px 3%;
  }

  .message-wrapper {
    position: fixed;
    top: 46px;
    bottom: 50px;
    left: 0;
    z-index: 15;
    width: 100%;
    overflow: auto;
  }

  .item-wrapper .number {
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
