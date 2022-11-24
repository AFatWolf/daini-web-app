<template>
  <div
    v-if="role != 'anon'"
    class="
      d-flex
      flex-column
      container
      border border-2 border-primary
      rounded rounded-2
      py-2
      px-3
      my-1
    "
  >
    <div class="row">
      <div class="d-flex flex-column col-sm-9 col-12">
        <div class="fs-4 fw-bold text-dark">
          {{ item.product?.name }}
        </div>
        <div class="fs-5 text-dark">
          {{ getTransactionStateDescription(item.state, t) }}
        </div>
        <div class="fs-6 text-dark">
          {{ $t('common.price') }}:&nbsp{{ item.product?.price }}
        </div>
        <div class="fs-6 text-dark">
          {{ $t('common.quantity') }}:&nbsp{{ item.product?.quantity }}
        </div>
      </div>
      <div class="d-flex flex-column my-auto col-sm-3 col-12 fs-7">
        <div v-if="role === TRANSACTION_SIDE.BUYER">
          <div v-if="item.state === TRANSACTION_STATE.DONE_ACCEPT_TO_SELL">
            <div class="d-flex flex-column">
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-success"
                @click="pay"
              >
                {{ $t('transaction.button.pay') }}
              </div>
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-danger"
                @click="cancelOrder"
              >
                {{ $t('transaction.button.cancel_order') }}
              </div>
            </div>
          </div>
          <div v-if="item.state === TRANSACTION_STATE.DONE_PAY">
            <div class="d-flex flex-column">
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-danger"
                @click="dispute"
              >
                {{ $t('transaction.button.dispute') }}
              </div>
            </div>
          </div>
          <div
            v-if="
              item.state === TRANSACTION_STATE.DONE_SET_WINNER &&
              item.winnerAlias === authStore.getAlias
            "
          >
            <div class="d-flex flex-column">
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-success"
                @click="getMoney(TRANSACTION_SIDE.BUYER)"
              >
                {{ $t('transaction.button.get_money_back') }}
              </div>
            </div>
          </div>
          <div v-if="item.state === TRANSACTION_STATE.DONE_SET_DELIVERED_GOODS">
            <div class="d-flex flex-column">
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-success"
                @click="setReceivedGoods"
              >
                {{ $t('transaction.button.received_goods') }}
              </div>
            </div>
            <div class="d-flex flex-column">
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-danger"
                @click="dispute"
              >
                {{ $t('transaction.button.dispute') }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="role === TRANSACTION_SIDE.SELLER">
          <!-- {{ $t('transaction.seller') }} -->
          <div v-if="item.state === TRANSACTION_STATE.DONE_BUY">
            <div class="d-flex flex-column">
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-success"
                @click="acceptToSell"
              >
                {{ $t('transaction.button.accept_to_sell') }}
              </div>
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-danger"
                @click="refuseToSell"
              >
                {{ $t('transaction.button.refuse_to_sell') }}
              </div>
            </div>
          </div>
          <div v-if="item.state === TRANSACTION_STATE.DONE_PAY">
            <div class="d-flex flex-column">
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-success"
                @click="setDeliveredGoods"
              >
                {{ $t('transaction.button.delivered_goods') }}
              </div>
            </div>
          </div>
          <div v-if="item.state === TRANSACTION_STATE.DONE_SET_DELIVERED_GOODS">
            <div class="d-flex flex-column">
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-danger"
                @click="dispute"
              >
                {{ $t('transaction.button.dispute') }}
              </div>
            </div>
          </div>
          <div
            v-if="
              (item.state === TRANSACTION_STATE.DONE_SET_WINNER ||
                item.state === TRANSACTION_STATE.DONE_SET_RECEIVED_GOODS) &&
              item.winnerAlias === authStore.getAlias
            "
          >
            <div class="d-flex flex-column">
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-success"
                @click="getMoney(TRANSACTION_SIDE.SELLER)"
              >
                {{ $t('transaction.button.get_money') }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="role === TRANSACTION_SIDE.MEDITATOR">
          <!-- {{ $t('transaction.meditator') }} -->
          <div v-if="item.state === TRANSACTION_STATE.DONE_DISPUTE">
            <div class="d-flex flex-column">
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-success"
                @click="setWinner(TRANSACTION_SIDE.BUYER)"
              >
                {{ $t('transaction.button.buyer_wins') }}
              </div>
              <div
                role="button"
                class="mb-1 rounded rounded-pill btn btn-success"
                @click="setWinner(TRANSACTION_SIDE.SELLER)"
              >
                {{ $t('transaction.button.seller_wins') }}
              </div>
            </div>
          </div>
        </div>
        <div v-else>{{ $t('common.error.something_is_wrong') }}</div>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useTransactionStore } from '@/stores/transaction'
import {
  TRANSACTION_STATE,
  TRANSACTION_SIDE,
  TRANSACTION_FIELDS,
} from '@/constants/transaction'
import { useAuthStore } from '@/stores/auth'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { t } = useLang()
    const soul = getGunNodeSoul(props.item)
    const transactionStore = useTransactionStore()
    const authStore = useAuthStore()

    return {
      t,
      soul,
      TRANSACTION_SIDE,
      TRANSACTION_STATE,
      transactionStore,
      authStore,
    }
  },
  computed: {
    role() {
      const { item } = this
      const alias = this.authStore.getAlias
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
  methods: {
    async acceptToSell() {
      const { err, ok } = await this.transactionStore.acceptToSell(this.soul)
      if (ok) {
        await putNotification({
          message: this.t('notification.transaction.done_accept_to_sell'),
        })
      } else if (err) {
        await putNotification({ message: this.t(err) })
      }
    },
    async pay() {
      const { err, ok } = await this.transactionStore.pay(this.soul)
      if (ok) {
        await putNotification({
          message: this.t('notification.transaction.done_pay'),
        })
      } else if (err) {
        await putNotification({ message: this.t(err) })
      }
    },
    async cancelOrder() {
      const { err, ok } = await this.transactionStore.cancelOrder(this.soul)
      if (ok) {
        await putNotification({
          message: this.t('notification.transaction.done_cancel_order'),
        })
      } else if (err) {
        await putNotification({ message: this.t(err) })
      }
    },
    async refuseToSell() {
      const { err, ok } = await this.transactionStore.refuseToSell(this.soul)
      if (ok) {
        await putNotification({
          message: this.t('notification.transaction.done_refuse_to_sell'),
        })
      } else if (err) {
        await putNotification({ message: this.t(err) })
      }
    },
    async dispute() {
      const { err, ok } = await this.transactionStore.dispute(this.soul)
      if (ok) {
        await putNotification({
          message: this.t('notification.transaction.done_dispute'),
        })
      } else if (err) {
        await putNotification({ message: this.t(err) })
      }
    },
    async setDeliveredGoods() {
      const { err, ok } = await this.transactionStore.setDeliveredGoods(
        this.soul
      )
      if (ok) {
        await putNotification({
          message: this.t('notification.transaction.done_set_delivered_goods'),
        })
      } else if (err) {
        await putNotification({ message: this.t(err) })
      }
    },
    async setReceivedGoods() {
      const { err, ok } = await this.transactionStore.setReceivedGoods(
        this.soul
      )
      if (ok) {
        await putNotification({
          message: this.t('notification.transaction.done_set_received_goods'),
        })
      } else if (err) {
        await putNotification({ message: this.t(err) })
      }
    },
    async setWinner(winner: TRANSACTION_SIDE) {
      const { err, ok } = await this.transactionStore.setWinner(
        this.soul,
        winner
      )
      if (ok) {
        await putNotification({
          message: this.t('notification.transaction.done_set_winner'),
        })
      } else if (err) {
        await putNotification({ message: this.t(err) })
      }
    },
    async getMoney(winner: TRANSACTION_SIDE) {
      const { err, ok } = await this.transactionStore.getMoney(
        this.soul,
        winner
      )
      if (ok) {
        await putNotification({
          message: this.t('notification.transaction.done_get_money'),
        })
      } else if (err) {
        await putNotification({ message: this.t(err) })
      }
    },
  },
}
</script>

<style>
</style>