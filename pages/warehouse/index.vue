<template>
  <div>
    <div class="container" v-if="hasProducts">
      <div class="row">
        <div class="fs-3 text-dark">
          {{ $t("warehouse.title") }}
        </div>
      </div>
      <WarehouseContainer :items="warehouseStore.getProductList" />
    </div>

    <div v-else>
      <div class="container">
        <div
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <div class="fs-2 fw-bold">
            {{ $t('warehouse.nothing') }}
          </div>
          <Anchor
            :to="WAREHOUSE_ROUTE.SELL"
            role="button"
            class="mt-4 btn btn-primary text-white fs-5"
          >
            {{ $t('warehouse.sell') }}
          </Anchor>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWarehouseStore } from '@/stores/warehouse'
import { WAREHOUSE_ROUTE } from '@/constants/common'

export default {
  setup() {
    const warehouseStore = useWarehouseStore()

    warehouseStore.fetchProducts()

    return {
      WAREHOUSE_ROUTE,
      warehouseStore,
    }
  },
  computed: {
    hasProducts({ warehouseStore }) {
      return warehouseStore.getProductList.length > 0
    },
  },
}
</script>

<style>
</style>