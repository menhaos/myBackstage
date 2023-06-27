<template>
  <div class="dashboard-container">
    <Card></Card>
    <Sale style="margin: 10px 0"></Sale>
    <ObServe></ObServe>
  </div>
</template>

<script>
import Card from './Card'
import Sale from './Sale'
import ObServe from './ObServe'
export default {
  name: 'Dashboard',
  components: {
    Card,
    Sale,
    ObServe,
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
}
</style>
