<template>
  <div class="container row">
    <div class="col-3" v-for="item in items" :key="item.id">
      <WarehouseItem :item="item" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style>
</style>