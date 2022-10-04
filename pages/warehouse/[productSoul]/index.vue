<template>
  <!-- TODO: check if projectdetail not null -->
  <div v-if="productDetail" class="d-flex flex-column align-items-start">
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
    <div v-for="(item, index) in items" :key="item">{{ index }}:&nbsp{{ item.status }}</div>
  </div>
</template>

<script>
import { useWarehouseStore } from '@/stores/warehouse'
import { useGun } from '@gun-vue/composables'

export default {
  setup() {
    const warehouseStore = useWarehouseStore()
    const appGun = useGunDb()
    const gun = useGun()

    return {
      warehouseStore,
      appGun,
      gun,
    }
  },
  data() {
    const { gun } = this
    const { productSoul } = getRouterParams(this)
    const productDetail = this.warehouseStore.getProductBySoul(productSoul)

    const itemsSoul = getGunNodeSoul(productDetail.items)
    const items = ref([])

    gun
      .get(itemsSoul)
      .map()
      .once((data) => {
        console.log('Data: ', data)
        items.value.push(data)
      })

    return {
      productSoul,
      productDetail,
      items,
    }
  },
  watch: {
    items(newItems) {
      console.log(newItems)
    },
  },
}
</script>

<style>
</style>