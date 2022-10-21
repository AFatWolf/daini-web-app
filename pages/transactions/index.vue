<template>
  <div>
    <TransactionContainer />
  </div>
</template>

<script>
import { useTransactionStore } from '@/stores/transaction'

export default {
  setup() {
    const transactionStore = useTransactionStore()
    transactionStore.fetchUserTransactions()

    return {}
  },
}
</script>

<style>
</style>