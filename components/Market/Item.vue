<template>
  <div class="card w-100">
    <!-- <Anchor :to=""> </Anchor> -->
    <!-- <img class="card-img-top" src="..." alt="Card image cap" /> -->
    <div class="card-body">
      <div class="fs-3 card-title">{{ item.name }}</div>
      <div class="fs-7 card-text">
        {{ item.description }}
      </div>
      <div class="d-flex flex-row">
        <div class="fs-7 flex-grow-1 text-dark">
          {{ $t('item.price') }}:&nbsp{{ item.price }}
        </div>
        <div
          v-if="item.leftQuantity"
          class="fs-7 d-flex flex-row"
        >
          <div class="text-dark">{{ item.leftQuantity }}&nbsp</div>
          <div class="text-secondary">
            {{ $t('item.left') }}
          </div>
        </div>
        <div v-else-if="item.leftQuantity === 0">
          <div class="text-danger">{{ $t('market.sold_out') }}</div>
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
      if (item.leftQuantity <= 0) {
        await putNotification({ message: t('error.no_product_left') })
        return
      }
      const quantity = 1 // TODO-REFACTOR: fix this
      const order: IOrder = {
        name: item.name,
        soul: productSoul,
        quantity: quantity,
        price: item.price * quantity,
        sellerAlias: item.sellerAlias,
        meditatorAlias:
          'XNKD4Nt89yDgpek_dW9-QzcAl_oJx0AlM7GEJSB76qs.763oIibNTRelwTZbRCFXTFx5PgxBihIXRW08HTdAMvk', // TODO-REMOVE
      }

      const { data, err, ok } = await transactionStore.buy(order)
      if (err) {
        console.error(t(err))
        await putNotification({ message: t(err) })
        return
      } else if (ok) {
        await putNotification({ message: t('notification.market.buy_success') })
      }
      console.log(data)
    },
  },
}
</script>

<style>
</style>