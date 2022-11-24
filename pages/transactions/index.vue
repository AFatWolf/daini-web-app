<template>
  <div>
    <div class="container" v-if="hasProducts">
      <div class="row">
        <div class="fs-3 text-dark">
          {{ $t('transaction.title') }}
        </div>
      </div>
      <TransactionContainer />
    </div>

    <div v-else>
      <div class="container">
        <div
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <div class="fs-2 fw-bold">
            {{ $t('transaction.nothing') }}
          </div>
          <Anchor
            :to="MARKET_ROUTE.INDEX"
            role="button"
            class="mt-4 btn btn-primary text-white fs-5"
          >
            {{ $t('transaction.go_to_market') }}
          </Anchor>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useTransactionStore } from '@/stores/transaction'
import { MARKET_ROUTE } from '@/constants/common'

export default {
  setup() {
    const transactionStore = useTransactionStore()
    transactionStore.fetchUserTransactions()

    return { transactionStore, MARKET_ROUTE }
  },
  computed: {
    hasProducts({ transactionStore }) {
      return transactionStore.getTransactionList.length > 0
    },
  },
}
</script>

<style>
</style>