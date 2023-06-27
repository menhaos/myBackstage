<template>
  <el-card class="sale">
    <!-- tabs组件 -->
    <el-tabs class="sale-tabs" @tab-click="tabClick">
      <el-tab-pane label="销售额" class="saleroom tab-item" :data-index="0">
        <div class="tab-chart" id="tab-chart-saleroom"></div>
        <div class="tab-list">
          <div class="tab-list-title">门店销售额排名</div>
          <ul>
            <li data-content-before="1">
              <span>肯德基</span><span>323,234</span>
            </li>
            <li data-content-before="2">
              <span>麦当劳</span><span>253,215</span>
            </li>
            <li data-content-before="3">
              <span>必胜客</span><span>233,544</span>
            </li>
            <li data-content-before="4">
              <span>乡村基</span><span>193,223</span>
            </li>
            <li data-content-before="5">
              <span>蜜雪冰城</span><span>153,564</span>
            </li>
            <li data-content-before="6">
              <span>罗森</span><span>143,784</span>
            </li>
            <li data-content-before="7">
              <span>茶铭</span><span>113,836</span>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="访问量" class="pageviews tab-item" :data-index="1">
        <div class="tab-chart" id="tab-chart-pageviews"></div>
        <div class="tab-list">
          <div class="tab-list-title">访问量排名</div>
          <ul>
            <li data-content-before="1">
              <span>蜜雪冰城</span><span>5643</span>
            </li>
            <li data-content-before="2">
              <span>乡村基</span><span>4522</span>
            </li>
            <li data-content-before="3">
              <span>麦当劳</span><span>4242</span>
            </li>
            <li data-content-before="4">
              <span>必胜客</span><span>3854</span>
            </li>
            <li data-content-before="5"><span>罗森</span><span>3554</span></li>
            <li data-content-before="6">
              <span>肯德基</span><span>3124</span>
            </li>
            <li data-content-before="7"><span>茶铭</span><span>2454</span></li>
          </ul>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 自定义日期组件 -->
    <DatePicker class="date-picker"></DatePicker>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import DatePicker from './DatePicker'
export default {
  name: 'sale',
  components: {
    DatePicker,
  },
  methods: {
    //初始化saleChart表格
    initSaleChart() {
      let saleChart = echarts.init(
        document.querySelector('#tab-chart-saleroom')
      )
      saleChart.setOption({
        title: {
          text: '销售额',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月',
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: [
              12531, 14544, 21400, 18424, 9457, 36424, 12102, 13212, 12255,
              21012, 38546, 11324,
            ],
          },
        ],
      })
    },
    //初始化viewsChart表格
    initViewChart() {
      let viewChart = echarts.init(
        document.querySelector('#tab-chart-pageviews')
      )
      viewChart.setOption({
        title: {
          text: '访问量',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月',
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: [
              2422, 1454, 2400, 1824, 4457, 3624, 1202, 1321, 2255, 2012, 3546,
              1124,
            ],
          },
        ],
      })
    },
    //点击tab栏切换时才重新初始化图表
    tabClick(tab) {
      if (tab.index == 1) {
        this.initViewChart()
      }
    },
  },
  mounted() {
    this.initSaleChart()
  },
}
</script>

<style lang="scss" scoped>
.sale {
  position: relative;
  .date-picker {
    z-index: 999;
    position: absolute;
    right: 20px;
    top: 20px;
  }
  .tab-item {
    height: 400px;
    display: flex;
    .tab-chart {
      height: 400px;
      width: 900px;
      margin-right: 10px;
    }
    .tab-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      .tab-list-title {
        font-size: 18px;
        font-weight: 700;
      }
      ul {
        list-style: none;
        margin: 20px 0;
        padding: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        li {
          height: 40px;
          line-height: 40px;
          padding-left: 120px;
          position: relative;
          span {
            &:nth-child(2) {
              float: right;
            }
          }
          &::before {
            content: attr(data-content-before);
            position: absolute;
            width: 20px;
            line-height: 20px;
            border-radius: 50%;
            text-align: center;
            left: 0;
            transform: translateY(50%);
            background-color: black;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>