<template>
  <div class="container">
    <div
      class="d-flex flex-column"
      v-if="transactionList.buyer.list.length > 0"
    >
      <div class="fs-3 text-dark">
        {{ $t('transaction.buyer_order') }}
      </div>
      <TransactionItem
        class="my-2"
        v-for="item in transactionList.buyer.list"
        :key="item.id"
        :item="item"
      />
    </div>
    <div
      class="d-flex flex-column"
      v-if="transactionList.seller.list.length > 0"
    >
      <div class="fs-3 text-dark">
        {{ $t('transaction.seller_order') }}
      </div>
      <TransactionItem
        v-for="item in transactionList.seller.list"
        :key="item.id"
        :item="item"
      />
    </div>
    <div
      class="d-flex flex-column"
      v-if="transactionList.meditator.list.length > 0"
    >
      <div class="fs-3 text-dark">
        {{ $t('transaction.meditator_order') }}
      </div>
      <TransactionItem
        v-for="item in transactionList.meditator.list"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useTransactionStore } from '@/stores/transaction'

export default {
  setup() {
    const transactionStore = useTransactionStore()
    const authStore = useAuthStore()
    return {
      authStore,
      transactionStore,
    }
  },
  computed: {
    transactionList() {
      const list = this.transactionStore.getTransactionList
      const alias = this.authStore.getAlias
      const asBuyerList = useFilter(
        list,
        (transaction) =>
          transaction.buyer?.alias && transaction.buyer.alias === alias
      )
      const asSellerList = useFilter(
        list,
        (transaction) =>
          transaction.seller?.alias && transaction.seller.alias === alias
      )
      const asMeditatorList = useFilter(
        list,
        (transaction) =>
          transaction.meditator?.alias && transaction.meditator.alias === alias
      )
      return {
        buyer: {
          list: asBuyerList,
        },
        seller: {
          list: asSellerList,
        },
        meditator: {
          list: asMeditatorList,
        },
      }
    },
  },
}
</script>

<style>
</style>