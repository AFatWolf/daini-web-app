<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script lang="ts">
import { useMarketStore } from '@/stores/market'

export default {
  setup() {
    const { t } = useLang()
    const marketStore = useMarketStore()

    marketStore.fetchProducts()
    return { t }
  },
}
</script>
