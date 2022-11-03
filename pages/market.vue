<template>
  <div class="container">
    <div class="fs-3 text-dark">
      {{ $t('market.title') }}
    </div>
    <MarketContainer :items="marketStore.getProductList" />
  </div>
</template>

<script>
import { useMarketStore } from '@/stores/market'

export default {
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