<template>
  <div class="container">
    <div class="row">
      <div
        class="col-3 mt-2 d-flex align-items-stretch"
        v-for="item in items"
        :key="item.id"
      >
        <MarketItem :item="item" />
      </div>
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