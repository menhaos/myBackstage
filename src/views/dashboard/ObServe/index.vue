<template>
  <div class="observe">
    <SearchHot class="observe-item"></SearchHot>
    <SaleShare class="observe-item"></SaleShare>
  </div>
</template>

<script>
import SearchHot from './SearchHot'
import SaleShare from './SaleShare'
export default {
  name: 'ObServe',
  components: {
    SaleShare,
    SearchHot,
  },
}
</script>

<style lang="scss" scoped>
.observe {
  display: flex;
  .observe-item {
    flex: 1;
    &:first-child {
      margin-right: 10px;
    }
  }
}
</style>