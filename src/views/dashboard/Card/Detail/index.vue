<template>
  <el-card class="detail" :body-style="{ padding: '15px' }">
    <div class="title">
      <span>{{ title }}</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="number">{{ number }}</div>
    <div class="chart">
      <slot name="chart"></slot>
    </div>
    <div class="tip">
      <slot name="tip"></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Detail',
  props: ['title', 'number'],
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  color: #a3a2a2;
}
.number {
  margin: 10px;
  font-size: 30px;
}
.chart {
  position: relative;
  margin-bottom: 10px;
  height: 70px;
  width: 100%;
  border-bottom: 2px solid #eee;
}
.tip {
  position: relative;
  margin-bottom: 0;
}
</style>

