<template>
  <div class="d-flex flex-column border border-3">
    <div class="fs-5 fw-bold text-dark">
      {{ item.product?.name }}
    </div>
    <div class="fs-6 text-dark">
      {{ $t('common.price') }}:&nbsp{{ item.product?.price }}
    </div>
    <div class="fs-6 text-dark">
      {{ $t('common.quantity') }}:&nbsp{{ item.product?.quantity }}
    </div>

    <div class="d-flex flex-row">
      <div>{{ $t('transaction.role') }}:&nbsp</div>
      <div v-if="role === TRANSACTION_SIDE.BUYER">
        {{ $t('transaction.buyer') }}
      </div>
      <div v-else-if="role === TRANSACTION_SIDE.SELLER">
        {{ $t('transaction.seller') }}
      </div>
      <div v-else-if="role === TRANSACTION_SIDE.MEDITATOR">
        {{ $t('transaction.meditator') }}
      </div>
      <div v-else>{{ $t('common.error.something_is_wrong') }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { useTransactionStore } from '@/stores/transaction'
import { TRANSACTION_SIDE } from '@/constants/transaction'
import { useAuthStore } from '@/stores/auth'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const soul = getGunNodeSoul(props.item)
    const transactionStore = useTransactionStore()
    const authStore = useAuthStore()
    // transactionStore.fetchSingleTransactionBySoul(soul)

    return {
      soul,
      TRANSACTION_SIDE,
      transactionStore,
      authStore,
    }
  },
  computed: {
    role() {
      const { item } = this
      const alias = this.authStore.getUsername
      if (item.buyer?.alias && item.buyer.alias === alias)
        return TRANSACTION_SIDE.BUYER
      if (item.seller?.alias && item.seller.alias === alias)
        return TRANSACTION_SIDE.SELLER
      if (item.meditator?.alias && item.meditator.alias === alias)
        return TRANSACTION_SIDE.MEDITATOR
      return 'anon'
    },
  },
  data() {
    return {
      to: '',
    }
  },
}
</script>

<style>
</style>