<template>
  <div class="d-flex flex-column align-items-center justify-content-start">
    <FormKit type="form" :actions="false" @submit="onSubmit">
      <FormKit
        v-model="form.name"
        type="text"
        name="name"
        :label="$t('common.name')"
        label-class="fs-6"
        outer-class="mb-3"
        input-class="w-100 p-2"
        validation="required"
      />
      <FormKit
        v-model="form.totalQuantity"
        type="text"
        name="name"
        :label="$t('common.quantity')"
        label-class="fs-6"
        outer-class="mb-3"
        input-class="w-100 p-2"
        :validation="`required|number|between:1,${MAX_ITEMS_TO_SELL}`"
      />
      <FormKit
        v-model="form.price"
        type="text"
        name="name"
        :label="$t('item.sell.price')"
        label-class="fs-6"
        outer-class="mb-3"
        input-class="w-100 p-2"
        :validation="`required|number|between:${MIN_PRICE_YEN},${MAX_PRICE_YEN}`"
      />
      <div
        type="submit"
        role="button"
        class="btn btn-primary text-white justify-content-center"
        @click="onSubmit"
      >
        {{ $t('item.sell.sell_item') }}
      </div>
    </FormKit>
  </div>
</template>

<script>
import {
  MAX_ITEMS_TO_SELL,
  MIN_PRICE_YEN,
  MAX_PRICE_YEN,
} from '@/constants/product'
import { useProductStore } from '@/stores/product'

export default {
  setup() {
    const productStore = useProductStore()

    return {
      productStore,
    }
  },
  data() {
    return {
      MAX_ITEMS_TO_SELL,
      MIN_PRICE_YEN,
      MAX_PRICE_YEN,
      form: {
        name: '',
        totalQuantity: 1,
        price: MIN_PRICE_YEN,
      },
    }
  },
  methods: {
    onSubmit() {
      this.productStore.sellProduct(this.form)
    },
  },
}
</script>

<style>
</style>