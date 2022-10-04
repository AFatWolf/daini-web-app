<template>
  <Anchor :to="to">{{ item }}</Anchor>
</template>

<script>
import { WAREHOUSE_ROUTE } from '@/constants/common'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const productSoul = getGunNodeSoul(props.item)
    const to = {
        name: WAREHOUSE_ROUTE.DETAIL,
        params: { productSoul } 
    }

    return { 
        to
    }
  }
}
</script>

<style>
</style>