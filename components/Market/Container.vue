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
      <!-- v-if="!marketStore.loading.fetchProducts" -->
      <!-- <Loading v-else /> -->
    </div>
  </div>
</template>

<script>
import { useMarketStore } from '@/stores/market'
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const marketStore = useMarketStore()

    return {
      marketStore,
    }
  },
}
</script>

<style>
</style>