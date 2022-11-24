<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <GlobalDialogs />
    </NuxtLayout>
  </div>
</template>

<script lang="ts">
import { useMarketStore } from '@/stores/market'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const { t } = useLang()
    const marketStore = useMarketStore()
    const auth = useAuthStore()

    marketStore.fetchProducts()
    auth.recall()
    return { t }
  },
}
</script>
