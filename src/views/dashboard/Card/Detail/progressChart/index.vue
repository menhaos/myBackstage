<template>
  <div id="progressChart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'progressChart',
  mounted() {
    let barChart = echarts.init(document.querySelector('#progressChart'))
    barChart.setOption({
      grid: {
        left: '3%',
        right: '4%',
        bottom: '25%',
        height: '50%',
      },
      xAxis: {
        show: false,
        type: 'value',
        boundaryGap: [0, 0.01],
        max: 100,
      },
      yAxis: {
        show: false,
        type: 'category',
        data: ['Brazil'],
      },
      series: [
        {
          type: 'bar',
          data: [83],
          showBackground: true,
          color: 'yellowgreen',
        },
      ],
    })
  },
}
</script>

<style lang="scss" scoped>
#progressChart {
  width: 100%;
  height: 100%;
}
</style>