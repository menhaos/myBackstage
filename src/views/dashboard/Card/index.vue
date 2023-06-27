<template>
  <div class="cards">
    <!-- 总销售额card -->
    <Detail class="card-item" title="总销售额" number="￥ 126560">
      <template v-slot:chart>
        <div class="card-content-text">
          <span>同日比&nbsp;&nbsp;56.67%</span>
          <i class="el-icon-caret-top" style="color: red"></i>
          <span style="margin-left: 10px">同日比&nbsp;&nbsp;19.16%</span>
          <i class="el-icon-caret-bottom" style="color: green"></i>
        </div>
      </template>
      <template v-slot:tip>
        <div class="card-tip">日销售额￥ 12423</div>
      </template>
    </Detail>
    <!-- 访问量card -->
    <Detail class="card-item" title="访问量" number="211479">
      <template v-slot:chart>
        <div class="card-content-chart">
          <lineChart></lineChart>
        </div>
      </template>
      <template v-slot:tip>
        <div class="card-tip">日访问量 30211</div>
      </template>
    </Detail>
    <!-- 支付笔数 -->
    <Detail class="card-item" title="支付笔数" number="221231">
      <template v-slot:chart>
        <div class="card-content-chart">
          <barChart></barChart>
        </div>
      </template>
      <template v-slot:tip>
        <div class="card-tip">转化率 65%</div>
      </template>
    </Detail>
    <!-- 运营活动效率 -->
    <Detail class="card-item" title="运营活动效率" number="83%">
      <template v-slot:chart>
        <div class="card-content-chart">
          <progressChart></progressChart>
        </div>
      </template>
      <template v-slot:tip>
        <div class="card-tip">
          <span>同日比&nbsp;&nbsp;56.67%</span>
          <i class="el-icon-caret-top" style="color: red"></i>
          <span style="margin-left: 10px">同日比&nbsp;&nbsp;19.16%</span>
          <i class="el-icon-caret-bottom" style="color: green"></i>
        </div>
      </template>
    </Detail>
  </div>
</template>

<script>
import lineChart from './Detail/lineChart'
import barChart from './Detail/barChart'
import progressChart from './Detail/progressChart'
import Detail from './Detail'
export default {
  name: 'Card',
  components: {
    Detail,
    lineChart,
    barChart,
    progressChart,
  },
}
</script>

<style lang="scss" scoped>
.cards {
  display: flex;
  .card-item {
    flex: 1;
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
  .card-content-text {
    font-size: 14px;
    position: absolute;
    bottom: 5px;
  }
  .card-content-chart {
    width: 100%;
    height: 100%;
  }
  .card-tip {
    font-size: 14px;
    font-weight: 700;
  }
}
</style>