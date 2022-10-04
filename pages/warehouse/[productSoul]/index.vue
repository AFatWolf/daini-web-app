<template>
  <!-- TODO: check if projectdetail not null -->
  <div class="d-flex flex-column align-items-start">
    <div class="d-flex flex-row fs-3 text-dark">
      <div>{{ $t('common.name') }}:&nbsp</div>
      <div>{{ productDetail.name }}</div>
    </div>
    <div class="d-flex flex-row fs-7 text-dark">
      <div>{{ $t('common.quantity') }}:&nbsp</div>
      <div>{{ productDetail.leftQuantity }}</div>
    </div>
    <div v-if="productDetail.price" class="d-flex flex-row fs-7 text-dark">
      <div>{{ $t('item.price') }}:&nbsp</div>
      <div>{{ productDetail.price }}</div>
    </div>
  </div>
</template>

<script>
import { useWarehouseStore } from '@/stores/warehouse'

export default {
  setup() {
    const warehouseStore = useWarehouseStore()

    return {
      warehouseStore,
    }
  },
  data() {
    const { productSoul } = getRouterParams(this)
    const productDetail = this.warehouseStore.getProductBySoul(productSoul)

    return {
      productSoul,
      productDetail,
    }
  },
}
</script>

<style>
</style>