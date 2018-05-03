<template>
  <transition name="move">
    <div class="wrapper b">
      <x-header :left-options="{backText: ''}">事件统计</x-header>
      <tab>
        <tab-item v-for="(item, index) in tab" :key='index' :selected="index == selectIndex" @on-item-click="onTabItemClick">{{item}}</tab-item>
      </tab>

      <div class="content-wrapper">
        <div v-show="selectIndex == 0">
          <v-tab></v-tab>
          <bar-shape></bar-shape>
          <div id="category" :style="{width: '100vw', height: '100vw'}"></div>
          <table-chart></table-chart>
        </div>
        <div v-show="selectIndex == 1">
          <v-tab></v-tab>
          <div id="top1" :style="{width: '100vw', height: '80vw'}"></div>
          <div id="top2" :style="{width: '100vw', height: '80vw'}"></div>
          <div id="top3" :style="{width: '100vw', height: '80vw'}"></div>
        </div>
        <div  v-show="selectIndex == 2">
          <div class="clear">
            <div id="kpiTree1" class="fl" :style="{width: '50vw', height: '50vw'}"></div>
            <div id="kpiTree2" class="fl" :style="{width: '50vw', height: '50vw'}"></div>
            <div id="kpiTree3" class="fl" :style="{width: '50vw', height: '50vw'}"></div>
            <div id="kpiTree4" class="fl" :style="{width: '50vw', height: '50vw'}"></div>
          </div>
          <div id="kpiLineTree" :style="{width: '100vw', height: '80vw'}"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

  import {XHeader, Tab, TabItem} from 'vux'
  import VTab from 'components/tab'
  import TableChart from 'components/table-chart'
  import BarShape from 'components/bar-shape'

  export default {
    name: "index",
    data() {
      return {
        tab: ["分类统计", "Top统计", "KPI统计"],
        selectIndex: 0,

        categoryColor: ["#CC0033", "#FF0000", "#FFFF00", "#FF9933", "#00CC00"],
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
        this.charts.categoryChart = this.$echarts.init(document.getElementById('category'))

        let option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color: this.categoryColor,
          legend: {
            x: 'center',
            y: 'bottom',
            data: ['极高', '高', '中', '低', '极低']
          },
          calculable: true,
          series: [
            {
              name: '面积模式',
              type: 'pie',
              radius: [30, 110],
              center: ['50%', '50%'],
              roseType: 'area',
              data: [
                {value: 10, name: '极高'},
                {value: 5, name: '高'},
                {value: 15, name: '中'},
                {value: 25, name: '低'},
                {value: 20, name: '极低'}
              ]
            }
          ]
        }
        this.charts.categoryChart.setOption(option)
      },
      initTab2() {
        this.charts.top1Chart = this.$echarts.init(document.getElementById('top1'))
        this.charts.top2Chart = this.$echarts.init(document.getElementById('top2'))
        this.charts.top3Chart = this.$echarts.init(document.getElementById('top3'))
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
            text: '数据来源（Top5）'
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
        this.charts.top3Chart.setOption(option2)
      },
      initTab3(){
        this.charts.kpiTree1 = this.$echarts.init(document.getElementById('kpiTree1'))
        this.charts.kpiTree2 = this.$echarts.init(document.getElementById('kpiTree2'))
        this.charts.kpiTree3 = this.$echarts.init(document.getElementById('kpiTree3'))
        this.charts.kpiTree4 = this.$echarts.init(document.getElementById('kpiTree4'))
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
              data: [{value: 50, name: '完成率'}],
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
            data:['误报率','漏报率','响应率','关闭率'],
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
              name:'误报率',
              type:'line',
              stack: '总量',
              data:[120, 132, 101, 134, 90, 230, 210]
            },
            {
              name:'漏报率',
              type:'line',
              stack: '总量',
              data:[220, 182, 191, 234, 290, 330, 310]
            },
            {
              name:'响应率',
              type:'line',
              stack: '总量',
              data:[150, 232, 201, 154, 190, 330, 410]
            },
            {
              name:'关闭率',
              type:'line',
              stack: '总量',
              data:[320, 332, 301, 334, 390, 330, 320]
            }
          ]
        }
        this.charts.kpiTree1.setOption(kpiOption)
        this.charts.kpiTree2.setOption(kpiOption)
        this.charts.kpiTree3.setOption(kpiOption)
        this.charts.kpiTree4.setOption(kpiOption)
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
      TableChart,
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
