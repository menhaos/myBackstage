<template>
  <div id="barChart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'barChart',
  mounted() {
    let barChart = echarts.init(document.querySelector('#barChart'))
    barChart.setOption({
      grid: {
        left: '10px',
        right: '10px',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        show: false,
        type: 'category',
        data: [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月',
        ],
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [
        {
          data: [
            12531, 14544, 21400, 18424, 9457, 36424, 12102, 13212, 12255, 21012,
            38546, 11324,
          ],
          type: 'bar',
        },
      ],
    })
  },
}
</script>

<style lang="scss" scoped>
#barChart {
  width: 100%;
  height: 100%;
}
</style>