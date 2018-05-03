<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">报障统计</x-header>
      <tab>
        <tab-item v-for="(item, index) in tab" :key='index' :selected="index == selectIndex" @on-item-click="onTabItemClick">{{item}}</tab-item>
      </tab>

      <div class="content-wrapper">
        <div v-show="selectIndex == 0">
          <v-tab></v-tab>
          <bar-shape></bar-shape>
          <div id="category1" :style="{width: '100vw', height: '80vw'}"></div>
          <div id="category2" :style="{width: '100vw', height: '80vw'}"></div>
        </div>
        <div v-show="selectIndex == 1">
          <v-tab></v-tab>
          <div id="top1" :style="{width: '100vw', height: '80vw'}"></div>
          <div id="top2" :style="{width: '100vw', height: '80vw'}"></div>
        </div>
        <div  v-show="selectIndex == 2">
          <div id="kpiTree" :style="{width: '100vw', height: '100vw'}"></div>
          <div id="kpiLineTree" :style="{width: '100vw', height: '80vw'}"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Tab, TabItem} from 'vux'
  import VTab from 'components/tab'
  import BarShape from 'components/bar-shape'

  export default {
    name: "index",
    data() {
      return {
        tab: ["分类统计", "Top统计", "KPI统计"],
        selectIndex: 0,

        charts: {}
      }
    },
    computed: {},
    created() {
      setTimeout(() => {
        this.initTab1()
        window.addEventListener('resize',this._resize,false);
      }, 20)
    },
    methods: {
      onTabItemClick(index) {
        this.selectIndex = index
        this["initTab" + (++index)]()
      },
      initTab1() {
        this.charts.category1Chart = this.$echarts.init(document.getElementById('category1'))
        this.charts.category2Chart = this.$echarts.init(document.getElementById('category2'))

        let option = {
          title : {
            text: '报障类型',
            x:'right',
            top: "20"
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            top: '55',
            data:['普通','问询', '可用性']
          },
          series: [
            {
              name:'访问来源',
              type:'pie',
              avoidLabelOverlap: false,
              data:[
                {value:335, name:'普通'},
                {value:310, name:'问询'},
                {value:310, name:'可用性'}
              ]
            }
          ]
        }
        let option2 = {
          title : {
            text: '满意度',
            x:'right',
            top: "20"
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            top: '55',
            data:['满意', '一般', '不满意']
          },
          series: [
            {
              name:'访问来源',
              type:'pie',
              avoidLabelOverlap: false,
              data:[{value:335, name:'满意'},{value:335, name:'一般'}, {value:310, name:'不满意'}]
            }
          ]
        }
        this.charts.category1Chart.setOption(option)
        /*let option2 = option
        option2.title.text = "满意度"
        option2.series.data = [{value:335, name:'满意'},{value:335, name:'一般'}, {value:310, name:'不满意'}]
        option2.legend.data = ['满意', '一般', '不满意']*/
        this.charts.category2Chart.setOption(option2)
      },
      initTab2() {
        this.charts.top1Chart = this.$echarts.init(document.getElementById('top1'))
        this.charts.top2Chart = this.$echarts.init(document.getElementById('top2'))
        let option1 = {
          title: {
            text: '业务分布（Top5）'
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: ['系统分类A', '系统分类B', '系统分类C', '系统分类D', '系统分类E']
          },
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          series: [
            {
              name: '2011年',
              type: 'bar',
              data: [18203, 23489, 29034, 104970, 131744],
              barWidth: 20
            },
          ]
        }
        let option2 = {
          title: {
            text: '人工报障部门（Top5）'
          },
          xAxis: {
            type: 'category',
            data: ['鹰眼', 'RNA', 'VMWARE', 'Spark', '金证']
          },
          yAxis: {
            type: 'value'
          },
          label: {
            normal: {
              show: true,
              position: 'insideTop'
            }
          },
          series: [{
            data: [120, 200, 150, 80, 70],
            type: 'bar',
            barWidth: 20,
          }]
        }
        this.charts.top1Chart.setOption(option1)
        this.charts.top2Chart.setOption(option2)
      },
      initTab3(){
        this.charts.kpiTree = this.$echarts.init(document.getElementById('kpiTree'))
        this.charts.kpiLineTree = this.$echarts.init(document.getElementById('kpiLineTree'))

        let kpiOption = {
          tooltip : {
            formatter: "{a} <br/>{b} : {c}%",
            textStyle: {fontSize: 6}
          },
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              radius : '88%',
              center: ['50%', '56%'],
              detail: {formatter:'{value}%'},
              data: [{value: 50, name: '关闭率'}],
              pointer: {width: 3, length: "60%"},
              title: {offsetCenter: [0, "80%"]},
            }
          ]
        }

        let kpiLineOption = {
          title: {
            text: 'KPI(7天)'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['关闭率'],
            top: 32
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一','周二','周三','周四','周五','周六','周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'关闭率',
              type:'line',
              stack: '总量',
              data:[320, 332, 301, 334, 390, 330, 320]
            }
          ]
        }
        this.charts.kpiTree.setOption(kpiOption)
        this.charts.kpiLineTree.setOption(kpiLineOption)
      },
      _resize(){
        for(let char in this.charts){
          this.charts[char].resize()
        }
      }
    },
    components: {
      XHeader,
      Tab,
      TabItem,

      VTab,
      BarShape
    }
  }
</script>

<style scoped>

  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 22;
    overflow-y: auto;
  }

  .content-wrapper {
    position: absolute;
    top: 88px;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: auto;
  }

</style>
