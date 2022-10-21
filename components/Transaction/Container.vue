<template>
  <div class="d-flex flex-column">
    <TransactionItem
      v-for="item in transactionStore.getTransactionList"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script>
import { useTransactionStore } from '@/stores/transaction'
export default {
  setup() {
    const transactionStore = useTransactionStore()

    return {
      transactionStore,
    }
  },
}
</script>

<style>
</style>