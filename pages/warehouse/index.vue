<template>
    <div>
        <WarehouseContainer :items="warehouseStore.getProductList"/>
    </div>
</template>

<script>
import { useWarehouseStore } from '@/stores/warehouse'

export default {
  setup() {
    const warehouseStore = useWarehouseStore()

    warehouseStore.fetchProducts()

    return {
        warehouseStore
    }
  },
}
</script>

<style>
</style>