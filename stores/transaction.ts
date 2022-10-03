import { TRANSACTION_STATE } from '@/constants/transasction'
import { Transaction, Side } from '@/interfaces/transaction'
import { defineStore } from 'pinia'
import { useGun } from '@gun-vue/composables'

export const useTransactionStore = defineStore('transaction', {
  state: (): Transaction => ({
    seller: '',
    buyer: '',
    meditator: '',
    item: '',
    quantity: 0,
    state: TRANSACTION_STATE.GENERATING_ALL_SIDES_KEY_PAIRS,
  }),
  actions: {
    /* Load transaction data
     * @param{string} id: transaction node id
     */
    loadTransaction(id: string) {
      const gun = useGun()
    },

    // Consider using decorator to separate Buyer and Seller

    /* Called when buyer click 'Buy' */
    buy() {
      // Generate buyer A's key pair
      // Get seller B's public key
      // Generate buyer's A secret
      // Encrypt buyer's A secret with B pub key
      // Send encrypted A's secret to B
      // Encrypt A's priv key with B key Y_B(X_A)
      // Encrypt Y_B(X_A) with Meditator's pub key Y_M(Y_B(X_A)) 
      // Send to Meditator
    },
    /* Called when seller accept transaction */
    accept() {
      // Get Encrypted Alice secret
      // Decrypt it
      // Generate Smart Ccontract's (SC) public key
      // Deploy SC ? (maybe let A do it) 
      // Generate seller's B secret
      // Encrypt seller's B secret with A pub key
      // Send encrypted B's secret to A

      // Encrypt B's priv key with A key Y_A(X_B)
      // Encrypt Y_A(X_B) with Meditator's pub key Y_M(Y_A(X_B)) 
      // Send to Meditator
    },
    pay() {
      // Get Encrypted seller Bob's secret
      // Decrypt it
      // Generate SC's public key
      // Send money to SC
    },
    /* Called when seller has delivered the goods */
    setDeliveredGoods() {},
    /* Called when buyer has received the goods */
    setReceivedGoods() {
      // Send Encrypted Y_B(X_A) to seller's B
    },
    /* Called when seller has received the money */
    setReceivedMoney() {},
    dispute() {},
    setWinner(side: Side) {}, // or maybe sideId
    /* Called when user want to cancel the transaction. Can depend on the state of transaction */
    cancel() {}
  },
})
