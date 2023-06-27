<template>
  <div id="lineChart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'lineChart',
  mounted() {
    let lineChart = echarts.init(document.querySelector('#lineChart'))
    lineChart.setOption({
      grid: {
        left: '10px',
        right: '10px',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['意向', '预购', '成交'],
      },
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [
        {
          type: 'line',
          smooth: true,
          data: [21051, 15323, 17512, 23545, 35515, 51321, 47212],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(58,77,233,0.8)',
              },
              {
                offset: 1,
                color: 'rgba(58,77,233,0.3)',
              },
            ]),
          },
        },
      ],
    })
  },
}
</script>

<style lang="scss" scoped>
#lineChart {
  width: 100%;
  height: 100%;
}
</style>

