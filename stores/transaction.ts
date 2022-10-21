import { TRANSACTION_STATE } from '~~/constants/transaction'
import { ITransaction, ISide, IOrder } from '@/interfaces/transaction'
import { defineStore } from 'pinia'
import { useGun, SEA } from '@gun-vue/composables'
import { ec as EC } from 'elliptic'
import { useAuthStore } from './auth'
import { TRANSACTIONS_KEY } from '@/constants/common'
import { IReturn } from '@/interfaces/common'

const ec = new EC('secp256k1')

interface ITransactionState {
  transactions: ITransaction[]
  transactionBySoul: {}
  transactionCurrent: ITransaction
  loading: {
    fetchUserTransactions: boolean
    fetchSingleTransaction: boolean
    buy: boolean
  }
}

export const useTransactionStore = defineStore('transaction', {
  state: (): ITransactionState => ({
    transactions: [],
    transactionBySoul: {},
    transactionCurrent: {
      id: '',
      state: TRANSACTION_STATE.DONE_BUY,
    },
    loading: {
      fetchUserTransactions: false,
      fetchSingleTransaction: false,
      buy: false,
    },
  }),
  getters: {
    getTransactionList: (state) => Object.values(state.transactionBySoul),
    getTransactionBySoul: (state) => {
      return (soul) => {
        return state.transactionBySoul[soul] || null
      }
    },
  },
  actions: {
    async fetchUserTransactions() {
      if (this.loading.fetchUserTransactions) return
      this.loading.fetchUserTransactions = true

      const authStore = useAuthStore()
      const userRef = authStore.getUserRef
      if (!authStore.isLoggedIn || !userRef) {
        return { err: 'error.not_logged_in' }
      }

      const userTransactionsRef = userRef.get(TRANSACTIONS_KEY)
      const transactions = await useMapOnceToPromise(userTransactionsRef)

      if (transactions.err) {
        this.loading.fetchUserTransactions = false

        return { err: 'error.cant_fetch_transactions' }
      }

      const keys = Object.keys(transactions)
      useRemove(keys, (key) => !isTransactionRefId(key))
      const selectedTransactions = usePick(transactions, keys)

      // unwrap data
      useForEach(selectedTransactions, (transaction) => {
        const soul = getGunNodeSoul(transaction)
        this.fetchSingleTransactionBySoul(soul)
      })

      this.loading.fetchUserTransactions = false
      return { data: this.transactions, ok: 1 }
    },
    /* Fetch single transaction data
     * @param{string} soul: transaction node soul
     */
    async fetchSingleTransactionBySoul(soul: string) {
      const gun = useGun()
      const transactionRef = gun.get(soul)
      let data = await useOnceToPromise(transactionRef)

      if (data.err || data.error) {
        return { err: 'error.cant_fetch_transactions' }
      }

      const buyerSoul = getGunNodeSoul(data.buyer)
      const sellerSoul = getGunNodeSoul(data.seller)
      const meditatorSoul = getGunNodeSoul(data.meditator)
      const productSoul = getGunNodeSoul(data.product)
      const buyer = await useOnceToPromise(gun.get(buyerSoul))
      let seller, meditator
      if (sellerSoul) seller = await useOnceToPromise(gun.get(sellerSoul))
      if (meditatorSoul)
        meditator = await useOnceToPromise(gun.get(meditatorSoul))
      const product = await useOnceToPromise(gun.get(productSoul))

      data = {
        ...data,
        buyer,
        seller,
        meditator,
        product,
      }

      this.transactionBySoul[soul] = data

      return { data, ok: 1 }
    },

    // Consider using decorator to separate Buyer and Seller

    /* Called when buyer click 'Buy' */
    async buy(order: IOrder) {
      if (this.loading.buy) return
      this.loading.buy = true

      const gun = useGun()
      const appGun = useGunDb()
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn || !authStore.userRef) {
        return { err: 'error.not_logged_in' }
      }

      // Individual keys in GUN SEA
      const buyerSeaPair = authStore.userInfo.sea // TODO: check if this is correct
      // Generate buyer A's key pair
      const buyerKeyPair = ec.genKeyPair()
      // Publish the pub key, hide the priv key
      const buyerPrivKey = buyerKeyPair.getPrivate()
      const buyerPubKey = buyerKeyPair.getPublic()

      const buyerPrivKeyJson = JSON.stringify(buyerPrivKey)
      const encryptedBuyerPrivKeyJson = await SEA.encrypt(
        buyerPrivKeyJson,
        buyerSeaPair
      )
      const buyerPubKeyJson = JSON.stringify(buyerPubKey)

      const {
        soul: productSoul,
        name: productName,
        quantity,
        price,
        sellerAlias,
      } = order
      const productId = useTruncate(buyerPubKeyJson) // temporary

      // Craft transaction
      const transaction: ITransaction = {
        id: productId,
        buyer: {
          alias: authStore.getUsername,
          epub: buyerPubKeyJson,
          epriv: encryptedBuyerPrivKeyJson,
        },
        seller: {
          alias: sellerAlias,
        },
        meditator: {
          alias: '',
        },
        product: {
          name: productName,
          soul: productSoul,
          quantity: quantity,
          price,
        },
        state: TRANSACTION_STATE.DONE_BUY,
      }
      // Create transaction on GUN DB
      const transactionsRef = appGun.get(TRANSACTIONS_KEY)
      const putData = await usePutToPromise(transactionsRef, {
        [transaction.id]: transaction,
      })
      if (putData.err) {
        this.loading.buy = false
        return { err: 'error.cant_buy_product' }
      }
      // Link transaction to Buyer
      const userRef = authStore.getUserRef
      const userTransactionsRef = userRef.get(TRANSACTIONS_KEY)
      const newTransactionRef = putData.ref

      const setData = await useSetToPromise(
        userTransactionsRef,
        newTransactionRef
      )
      if (setData.err) {
        return { err: 'error.cant_buy_product' }
      }
      // Link transaction to Seller
      

      this.loading.buy = false


      return { data: putData, ok: 1 }
    },
    acceptToSell(productSoul: string) {
      // Generate seller B's key pair
      const sellerKeyPair = ec.genKeyPair()
      // publish the pub key, hide the priv key
      const sellerPrivKey = sellerKeyPair.getPrivate()
      const sellerPubKey = sellerKeyPair.getPublic()
    },
    proceedToBuy() {
      // Get seller B's public key

      // Generate buyer's A secret
      const sharedSecret = AkeyPair.derive(BkeyPublic)
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
    cancel() {},
  },
})
