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
import { useRelays, defaultPeer } from '@gun-vue/composables'
import { useStorage } from '@vueuse/core'

export default {
  async setup() {
    const { t } = useLang()
    const marketStore = useMarketStore()
    const auth = useAuthStore()

    marketStore.fetchProducts()
    auth.recall()

    const data = useRelays()
    const peersData = await data.loadRelays()
    // Keys are peer URL
    const peers = Object.keys(peersData)
    if (peers.length > 0) {
      const GUNpeer = useStorage('peer', defaultPeer)
      GUNpeer.value = peers[0]
    }

    return { t }
  },
}
</script>
