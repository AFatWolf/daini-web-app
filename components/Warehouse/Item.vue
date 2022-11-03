<template>
  <Anchor class="text-decoration-none w-100" :to="to">
    <div class="card w-100 h-100">
      <!-- <img class="card-img-top" src="..." alt="Card image cap" /> -->
      <div class="card-body">
        <div class="fs-3 card-title">{{ item.name }}</div>
        <div class="fs-7 card-text">
          {{ item.description }}
        </div>
        <div class="d-flex flex-row">
          <div class="fs-7 flex-grow-1 text-dark">
            {{ item.price }}
          </div>
          <div
            v-if="item.leftQuantity || item.leftQuantity === 0"
            class="fs-7 d-flex flex-row"
          >
            <div class="text-dark">{{ item.leftQuantity }}&nbsp</div>
            <div class="text-secondary">
              {{ $t('item.left') }}
            </div>
          </div>
        </div>

        <div class="btn btn-primary text-white">
          {{ $t('common.view') }}
        </div>
      </div>
    </div>
  </Anchor>
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
      params: { productSoul },
    }

    return {
      to,
    }
  },
}
</script>

<style>
</style>