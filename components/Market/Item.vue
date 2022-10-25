<template>
  <div class="card">
    <!-- <Anchor :to=""> </Anchor> -->
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

      <div role="button" class="btn btn-primary text-white" @click="onPurchase">
        {{ $t('common.purchase') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useTransactionStore } from '@/stores/transaction'
import { IOrder } from '@/interfaces/transaction'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const productSoul = getGunNodeSoul(props.item)
    const transactionStore = useTransactionStore()
    const { t } = useLang()

    return {
      t,
      productSoul,
      transactionStore,
    }
  },
  methods: {
    async onPurchase() {
      const { t, transactionStore, item, productSoul } = this
      const quantity = 1 // TODO: fix this
      const order: IOrder = {
        name: item.name,
        soul: productSoul,
        quantity: quantity, 
        price: item.price * quantity,
        sellerAlias: item.sellerAlias,
        meditatorAlias: 'MTgzjtlGTz8d4EyOxeRbFw94A-9i09ZwmwG-uAOvgw0.1LVb2lzKP6GXuk2wdcL3cb4bA69IThblD-g0G4k8504' // TODO-REMOVE
      }

      const { data, err } = await transactionStore.buy(order)
      if(err) {
        console.error(t(err))
        return
      } 
      console.log(data)
    },
  },
}
</script>

<style>
</style>