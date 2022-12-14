import {
  TRANSACTION_STATE,
  TRANSACTION_FIELDS,
  TRANSACTION_SIDE,
  TRANSACTION_STATE_SEQUENCE,
} from '@/constants/transaction'
import { ITransaction, ISide, IOrder } from '@/interfaces/transaction'
import { defineStore } from 'pinia'
import { useGun, SEA } from '@gun-vue/composables'
import { ec as EC } from 'elliptic'
import { useAuthStore } from './auth'
import { TRANSACTIONS_KEY } from '@/constants/common'
import Web3 from 'web3'
import { GAS_FEE, GAS_PRICE } from '@/constants/transaction'
import { useMarketStore } from './market'

const ec = new EC('secp256k1')
const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545')

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
    getTransactionList: (state) =>
      useSortBy(Object.values(state.transactionBySoul), [
        (obj) => -TRANSACTION_STATE_SEQUENCE[obj.state],
      ]), // Large -> Small
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
      const userTransactionsRef =
        authStore.fetchPublicCurrentUserRef(TRANSACTIONS_KEY)

      if (!authStore.isLoggedIn || !userTransactionsRef) {
        return { err: 'error.not_logged_in' }
      }
      // Do it like warehouse
      userTransactionsRef.map().once((data) => {
        console.log('Transactions:', data)
      })

      const transactions = await useMapOnceToPromise(userTransactionsRef)
      // const transactions = {}

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
    /**
     * Update local transaction data
     * @param soul
     */
    setLocalTransactionBySoul(soul, args = {}) {
      const transaction = this.transactionBySoul[soul]
      if (transaction) {
        this.transactionBySoul[soul] = {
          ...transaction,
          ...args,
        }
      }
    },
    // Consider using decorator to separate Buyer and Seller

    /* Called when buyer click 'Buy' */
    async buy(order: IOrder) {
      if (this.loading.buy) return
      this.loading.buy = true

      const gun = useGun()
      const appGun = useGunDb()
      const authStore = useAuthStore()
      const marketStore = useMarketStore()
      if (!authStore.isLoggedIn || !authStore.userRef) {
        return { err: 'error.not_logged_in' }
      }

      // Individual keys in GUN SEA
      const buyerSeaPair = authStore.userInfo.sea // TODO: check if this is correct
      // Generate buyer A's key pair
      const buyerKeyPair = ec.genKeyPair()
      const stringifiedBuyerKeyPair = await stringifyECKeyPair(
        buyerKeyPair,
        buyerSeaPair
      )

      const {
        soul: productSoul,
        name: productName,
        quantity,
        price,
        sellerAlias,
        meditatorAlias,
      } = order
      const productId = useTruncate('["' + stringifiedBuyerKeyPair.epub) // temporary

      // Update product left quantity
      const productRef = gun.get(productSoul)
      const productData = await useOnceToPromise(productRef)
      if (productData.leftQuantity <= 0) {
        this.loading.buy = false
        return { err: 'error.cant_buy_product' }
      }
      const putProductRet = await usePutToPromise(productRef, {
        leftQuantity: productData.leftQuantity - quantity,
      })
      if (putProductRet.err) {
        this.loading.buy = false
        return { err: 'error.cant_buy_product' }
      }
      // Set Local Product Data
      marketStore.setLocalProductWithSoul(productSoul, {
        leftQuantity: productData.leftQuantity - quantity,
      })
      // Craft transaction
      const transaction: ITransaction = {
        id: productId,
        buyer: {
          alias: authStore.getAlias,
          ...stringifiedBuyerKeyPair,
        },
        seller: {
          alias: sellerAlias,
        },
        meditator: {
          alias: meditatorAlias,
        },
        product: {
          name: productName,
          soul: productSoul,
          quantity: quantity,
          price: price * quantity, // in Yen
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

      const newTransactionRef = putData.ref
      // Link transaction to Seller
      const sellerTransactionRef = authStore.fetchPublicUserRef(
        sellerAlias,
        TRANSACTIONS_KEY
      )
      const sellerSetData = await useSetToPromise(
        sellerTransactionRef,
        newTransactionRef
      )
      if (sellerSetData.err) {
        return { err: 'error.cant_link_bought_product' }
      }
      // Link transaction to Buyer
      const userTransactionsRef =
        authStore.fetchPublicCurrentUserRef(TRANSACTIONS_KEY)

      const setData = await useSetToPromise(
        userTransactionsRef,
        newTransactionRef
      )
      if (setData.err) {
        return { err: 'error.cant_buy_product' }
      }
      // Link transaction to Meditator
      const meditatorTransactionRef = authStore.fetchPublicUserRef(
        meditatorAlias,
        TRANSACTIONS_KEY
      )

      const meditatorSetData = await useSetToPromise(
        meditatorTransactionRef,
        newTransactionRef
      )
      if (meditatorSetData.err) {
        return { err: 'error.cant_buy_product' }
      }

      this.loading.buy = false

      return { data: putData, ok: 1 }
    },

    /* Called when a buyer buy a product and accept it */
    async acceptToSell(transactionSoul: string) {
      const gun = useGun()
      const appGun = useGunDb()
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn || !authStore.userRef) {
        return { err: 'error.not_logged_in' }
      }

      const transactionRef = gun.get(transactionSoul)
      const { buyer: buyerLink, meditator: meditatorLink } =
        await useOnceToPromise(transactionRef)

      const buyerSoul = getGunNodeSoul(buyerLink)
      const buyer = await useOnceToPromise(gun.get(buyerSoul))
      const meditatorSoul = getGunNodeSoul(meditatorLink)
      const meditator = await useOnceToPromise(gun.get(meditatorSoul))

      if (!buyer.alias || !meditator.alias) {
        return { err: 'error.cant_accept_this_transaction' }
      }

      // Get buyer A's public key
      const buyerKeyPair = await parseTransactionKeyPair(buyer)

      // Individual keys in GUN SEA
      const sellerSeaPair = authStore.userInfo.sea // TODO: check if this is correct
      // Generate seller B's key pair
      const sellerKeyPair = ec.genKeyPair()
      const stringifiedSellerKeyPair = await stringifyECKeyPair(
        sellerKeyPair,
        sellerSeaPair
      )

      // Genearte Seller B's shared secret
      const sharedSecret = sellerKeyPair.derive(buyerKeyPair.getPublic()) // d_c
      const sellerSharedSecret = sellerKeyPair.getPrivate().add(sharedSecret) //d_b + d_c
      const sellerSharedSecretPair = ec.keyFromPrivate(sellerSharedSecret)
      const sellerSharedSecretPubKey = sellerSharedSecretPair.getPublic() // Qbc = (d_b + d_c) * G, shared this with Buyer

      const sharedPassphrase = await getSharedSecretPassphrase(buyer.alias) // for exchanging information only
      // Encrypt the secret with A's sea pub key
      const encryptedSellerSharedSecretPubKey = await SEA.encrypt(
        sellerSharedSecretPubKey.encode('hex'),
        sharedPassphrase
      )
      // Calculate secret place to transfer money: Q_abc = Qbc + Qa
      // Then encode it to String
      const BCPublicKey = sellerSharedSecretPubKey
        .add(buyerKeyPair.getPublic())
        .encode('hex')
      const BCAddress = getBCAddress(BCPublicKey)
      const encryptedBCAddress = await SEA.encrypt(BCAddress, sellerSeaPair)
      console.log('(acceptToSell) BC address: ', BCAddress)
      // Encrypt B's priv key with shared passphrase of B and A using SEA.secret
      const { epriv: encSellerPrivKey } = await stringifyECKeyPair(
        sellerKeyPair,
        sharedPassphrase
      )
      // Encrypt that with shared passphrase of B and meditator using SEA.secret
      const sharedPassphraseBM = await getSharedSecretPassphrase(
        meditator.alias
      )
      const encryptedSellerPrivKey = await SEA.encrypt(
        encSellerPrivKey,
        sharedPassphraseBM
      )

      const putData = await usePutToPromise(gun.get(transactionSoul), {
        [TRANSACTION_FIELDS.BUYER]: {
          publicSharedSecret: encryptedSellerSharedSecretPubKey,
        },
        [TRANSACTION_FIELDS.SELLER]: {
          ...stringifiedSellerKeyPair,
          BCAddress: encryptedBCAddress,
        },
        [TRANSACTION_FIELDS.MEDITATOR]: {
          sellerEpriv: encryptedSellerPrivKey, // Send to Meditator
        },
        state: TRANSACTION_STATE.DONE_ACCEPT_TO_SELL,
      })

      if (putData.err) {
        return { err: 'error.cant_accept_this_transaction' }
      }
      /* Update local data to update UI */
      this.setLocalTransactionBySoul(transactionSoul, {
        state: TRANSACTION_STATE.DONE_ACCEPT_TO_SELL,
      })
      return { data: putData, ok: 1 }
    },
    /* Called when a buyer buy a product and accept it */
    async refuseToSell(transactionSoul: string) {
      const gun = useGun()
      const appGun = useGunDb()
      const authStore = useAuthStore()
      const marketStore = useMarketStore()
      if (!authStore.isLoggedIn || !authStore.userRef) {
        return { err: 'error.not_logged_in' }
      }
      const transactionRef = gun.get(transactionSoul)
      const { seller: sellerLink, product: productLink } =
        await useOnceToPromise(transactionRef)

      const sellerSoul = getGunNodeSoul(sellerLink)
      const productSoul = getGunNodeSoul(productLink)
      const seller = await useOnceToPromise(gun.get(sellerSoul))
      const product = await useOnceToPromise(gun.get(productSoul)) // product transaction data
      if (authStore.getAlias !== seller.alias) {
        return { err: 'error.cant_refuse_this_transaction' }
      }

      // Update product left quantity
      const productRef = gun.get(product.soul)
      const productData = await useOnceToPromise(productRef)
      const putProductRet = await usePutToPromise(productRef, {
        leftQuantity: productData.leftQuantity + product.quantity,
      })
      if (putProductRet.err) {
        this.loading.buy = false
        return { err: 'error.cant_refuse_this_transaction' }
      }
      // Set Local Product Data
      marketStore.setLocalProductWithSoul(productSoul, {
        leftQuantity: productData.leftQuantity + productData.quantity,
      })

      const putData = await usePutToPromise(gun.get(transactionSoul), {
        state: TRANSACTION_STATE.DONE_REFUSE_TO_SELL,
      })

      if (putData.err) {
        return { err: 'error.cant_refuse_this_transaction' }
      }
      /* Update local data to update UI */
      this.setLocalTransactionBySoul(transactionSoul, {
        state: TRANSACTION_STATE.DONE_REFUSE_TO_SELL,
      })
      return { data: putData, ok: 1 }
    },
    async cancelOrder(transactionSoul: string) {
      const gun = useGun()
      const appGun = useGunDb()
      const authStore = useAuthStore()
      const marketStore = useMarketStore()
      if (!authStore.isLoggedIn || !authStore.userRef) {
        return { err: 'error.not_logged_in' }
      }
      const transactionRef = gun.get(transactionSoul)
      const { buyer: buyerLink, product: productLink } = await useOnceToPromise(
        transactionRef
      )

      const buyerSoul = getGunNodeSoul(buyerLink)
      const productSoul = getGunNodeSoul(productLink)
      const buyer = await useOnceToPromise(gun.get(buyerSoul))
      const product = await useOnceToPromise(gun.get(productSoul)) // product transaction data
      if (authStore.getAlias !== buyer.alias) {
        return { err: 'error.cant_cancel_this_transaction' }
      }

      // Update product left quantity
      const productRef = gun.get(product.soul)
      const productData = await useOnceToPromise(productRef)
      const putProductRet = await usePutToPromise(productRef, {
        leftQuantity: productData.leftQuantity + product.quantity,
      })
      if (putProductRet.err) {
        this.loading.buy = false
        return { err: 'error.cant_refuse_this_transaction' }
      }
      // Set Local Product Data
      marketStore.setLocalProductWithSoul(productSoul, {
        leftQuantity: productData.leftQuantity + productData.quantity,
      })

      const putData = await usePutToPromise(gun.get(transactionSoul), {
        state: TRANSACTION_STATE.DONE_CANCEL,
      })

      if (putData.err) {
        return { err: 'error.cant_cancel_this_transaction' }
      }
      /* Update local data to update UI */
      this.setLocalTransactionBySoul(transactionSoul, {
        state: TRANSACTION_STATE.DONE_CANCEL,
      })
      return { data: putData, ok: 1 }
    },
    /* Called from buyer side to proceed with the transaction*/
    async pay(transactionSoul: string) {
      const gun = useGun()
      const appGun = useGunDb()
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn || !authStore.userRef) {
        return { err: 'error.not_logged_in' }
      }
      const transactionRef = gun.get(transactionSoul)
      const {
        buyer: buyerLink,
        seller: sellerLink,
        meditator: meditatorLink,
        product: productLink,
      } = await useOnceToPromise(transactionRef)

      const buyerSoul = getGunNodeSoul(buyerLink)
      const sellerSoul = getGunNodeSoul(sellerLink)
      const meditatorSoul = getGunNodeSoul(meditatorLink)
      const productSoul = getGunNodeSoul(productLink)
      const buyer = await useOnceToPromise(gun.get(buyerSoul))
      const seller = await useOnceToPromise(gun.get(sellerSoul))
      const meditator = await useOnceToPromise(gun.get(meditatorSoul))
      const product = await useOnceToPromise(gun.get(productSoul))
      if (!seller.alias || !meditator.alias || !product.price) {
        return { err: 'error.cant_proceed_this_transaction' }
      }

      // Get seller B's public key
      const sellerKeyPair = await parseTransactionKeyPair(seller)

      // Get buyer A's public and private key
      const buyerSeaPair = authStore.userInfo.sea
      const buyerKeyPair = await parseTransactionKeyPair(buyer, buyerSeaPair)

      const sharedPassphrase = await getSharedSecretPassphrase(buyer.alias) // for exchanging information only

      // Generate buyer's A shared secret d_c
      const sharedSecret = buyerKeyPair.derive(sellerKeyPair.getPublic()) // d_c
      const buyerSharedSecret = buyerKeyPair.getPrivate().add(sharedSecret) //d_a + d_c
      const buyerSharedSecretPair = ec.keyFromPrivate(buyerSharedSecret)
      const buyerSharedSecretPubKey = buyerSharedSecretPair.getPublic() // Qac = (d_a + d_c) * G

      // Encrypt the secret with AB's shared secret key
      const encryptedBuyerSharedSecretPubKey = await SEA.encrypt(
        buyerSharedSecretPubKey.encode('hex'),
        sharedPassphrase
      )
      // Calculate secret place to transfer money: Q_abc = Qac + Qb
      // Then encode it to String
      const BCAddressPublicKey = buyerSharedSecretPubKey
        .add(sellerKeyPair.getPublic())
        .encode('hex')
      const BCAddress = getBCAddress(BCAddressPublicKey)
      // TODO-REMOVE
      console.log('(Pay) BC address: ', BCAddress)
      const priceInWei =
        getExchangeYenToWei(product.price) + GAS_FEE * GAS_PRICE
      const { hash, err } = await makeTransaction(BCAddress, priceInWei)
      if (err || !hash) {
        return { err: 'error.cant_proceed_this_transaction' }
      }
      const encryptedBCAddress = await SEA.encrypt(BCAddress, buyerSeaPair)

      // Send money to the Address

      // Encrypt A's priv key da with AB's shared key Y_AB(X_A)
      const { epriv: encBuyerPrivateKey } = await stringifyECKeyPair(
        buyerKeyPair,
        sharedPassphrase
      )
      // Encrypt Y_AB(X_A) with A-Meditator's shared key Y_AM(Y_AB(X_A))
      const sharedPassphraseAM = await getSharedSecretPassphrase(
        meditator.alias
      ) // get from transaction data
      const encryptedBuyerPrivateKey = await SEA.encrypt(
        encBuyerPrivateKey,
        sharedPassphraseAM
      )
      // Send to Meditator

      // Send encrypted A's secret to B
      const putData = await usePutToPromise(gun.get(transactionSoul), {
        [TRANSACTION_FIELDS.BUYER]: {
          BCAddress: encryptedBCAddress,
        },
        [TRANSACTION_FIELDS.SELLER]: {
          publicSharedSecret: encryptedBuyerSharedSecretPubKey, // TODO-REMOVE
        },
        [TRANSACTION_FIELDS.MEDITATOR]: {
          buyerEpriv: encryptedBuyerPrivateKey,
        },
        state: TRANSACTION_STATE.DONE_PAY,
      })

      if (putData.err) {
        return { err: 'error.cant_proceed_this_transaction' }
      }
      /* Update local data to update UI */
      this.setLocalTransactionBySoul(transactionSoul, {
        state: TRANSACTION_STATE.DONE_PAY,
      })
      return { data: putData, ok: 1 }
    },
    /* Called when seller has delivered the goods */
    async setDeliveredGoods(transactionSoul: string) {
      const gun = useGun()
      const appGun = useGunDb()
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn || !authStore.userRef) {
        return { err: 'error.not_logged_in' }
      }

      const putData = await usePutToPromise(gun.get(transactionSoul), {
        state: TRANSACTION_STATE.DONE_SET_DELIVERED_GOODS,
      })

      if (putData.err) {
        return { err: 'error.cant_set_delivered_this_transaction' }
      }
      /* Update local data to update UI */
      this.setLocalTransactionBySoul(transactionSoul, {
        state: TRANSACTION_STATE.DONE_SET_DELIVERED_GOODS,
      })
      return { data: putData, ok: 1 }
    },
    /* Called when buyer has received the goods */
    async setReceivedGoods(transactionSoul: string) {
      // Send Encrypted Buyer's Private Key Y_B(X_A) to seller's B
      const gun = useGun()
      const appGun = useGunDb()
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn || !authStore.userRef) {
        return { err: 'error.not_logged_in' }
      }
      const transactionRef = gun.get(transactionSoul)
      const { buyer: buyerLink, seller: sellerLink } = await useOnceToPromise(
        transactionRef
      )

      const buyerSoul = getGunNodeSoul(buyerLink)
      const sellerSoul = getGunNodeSoul(sellerLink)
      const buyer = await useOnceToPromise(gun.get(buyerSoul))
      const seller = await useOnceToPromise(gun.get(sellerSoul))

      if (!buyer.alias || !seller.alias) {
        return { err: 'error.cant_proceed_this_transaction' }
      }
      // Get buyer A's public and private key
      const buyerSeaPair = authStore.userInfo.sea
      const buyerKeyPair = await parseTransactionKeyPair(buyer, buyerSeaPair)
      const sharedPassphrase = await getSharedSecretPassphrase(seller.alias) // for exchanging information only
      // Encrypt A's priv key da with AB's shared key Y_AB(X_A)
      const { epriv: encBuyerPrivateKey } = await stringifyECKeyPair(
        buyerKeyPair,
        sharedPassphrase
      )

      const putData = await usePutToPromise(gun.get(transactionSoul), {
        state: TRANSACTION_STATE.DONE_SET_RECEIVED_GOODS,
        winnerAlias: seller.alias,
        BCEpriv: encBuyerPrivateKey,
      })

      if (putData.err) {
        return { err: 'error.cant_set_received_this_transaction' }
      }
      /* Update local data to update UI */
      this.setLocalTransactionBySoul(transactionSoul, {
        state: TRANSACTION_STATE.DONE_SET_RECEIVED_GOODS,
      })
      return { data: putData, ok: 1 }
    },
    /* Called when seller has received the money */
    async setReceivedMoney(transactionSoul: string) {
      // Basically, the winner is seller, the loser is buyer
      return await this.getMoney(transactionSoul, TRANSACTION_SIDE.SELLER)
    },
    async dispute(transactionSoul: string) {
      const gun = useGun()
      const appGun = useGunDb()
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn || !authStore.userRef) {
        return { err: 'error.not_logged_in' }
      }

      const putData = await usePutToPromise(gun.get(transactionSoul), {
        state: TRANSACTION_STATE.DONE_DISPUTE,
      })

      if (putData.err) {
        return { err: 'error.cant_dispute_this_transaction' }
      }
      /* Update local data to update UI */
      this.setLocalTransactionBySoul(transactionSoul, {
        state: TRANSACTION_STATE.DONE_DISPUTE,
      })
      return { data: putData, ok: 1 }
    },
    async setWinner(transactionSoul: string, winnerSide: TRANSACTION_SIDE) {
      const gun = useGun()
      const appGun = useGunDb()
      const authStore = useAuthStore()
      const marketStore = useMarketStore()
      if (!authStore.isLoggedIn || !authStore.userRef) {
        return { err: 'error.not_logged_in' }
      }
      const transactionRef = gun.get(transactionSoul)
      const {
        buyer: buyerLink,
        seller: sellerLink,
        meditator: meditatorLink,
        product: productLink,
      } = await useOnceToPromise(transactionRef)
      debugger
      const buyerSoul = getGunNodeSoul(buyerLink)
      const sellerSoul = getGunNodeSoul(sellerLink)
      const meditatorSoul = getGunNodeSoul(meditatorLink)
      const productSoul = getGunNodeSoul(productLink)
      const buyer = await useOnceToPromise(gun.get(buyerSoul))
      const seller = await useOnceToPromise(gun.get(sellerSoul))
      const meditator = await useOnceToPromise(gun.get(meditatorSoul))
      const product = await useOnceToPromise(gun.get(productSoul)) // product transaction data

      if (!buyer.alias || !seller.alias) {
        return { err: 'error.cant_proceed_this_transaction' }
      }
      let loser, winner, encryptedLoserEpriv
      if (winnerSide == TRANSACTION_SIDE.BUYER) {
        winner = buyer
        loser = seller
        encryptedLoserEpriv = meditator[TRANSACTION_FIELDS.SELLER_EPRIV]
        // Update product left quantity

        const productRef = gun.get(product.soul)
        const productData = await useOnceToPromise(productRef)
        const putProductRet = await usePutToPromise(productRef, {
          leftQuantity: productData.leftQuantity + product.quantity,
        })
        // Set Local Product Data
        marketStore.setLocalProductWithSoul(productSoul, {
          leftQuantity: productData.leftQuantity + productData.quantity,
        })
      } else {
        winner = seller
        loser = buyer
        encryptedLoserEpriv = meditator[TRANSACTION_FIELDS.BUYER_EPRIV]
      }
      // // Passphrase between Winner and Meditator
      const sharedPassphraseWM = await getSharedSecretPassphrase(winner.alias)
      // Passphrase between Loser and Meditator
      const sharedPassphraseLM = await getSharedSecretPassphrase(loser.alias)
      console.log('Shared passphrase LM: ', sharedPassphraseLM)

      if (sharedPassphraseLM.err) {
        console.log(sharedPassphraseLM.err)
        return { err: 'error.cant_set_winner_for_this_transaction' }
      }
      // loserEpriv is still encrypted by shared passphrase between loser and winner
      // It will be object, so we have to stringify it again
      const loserEpriv = JSON.stringify(
        await SEA.decrypt(encryptedLoserEpriv, sharedPassphraseLM)
      )

      const putData = await usePutToPromise(gun.get(transactionSoul), {
        state: TRANSACTION_STATE.DONE_SET_WINNER,
        winnerAlias: winner.alias,
        BCEpriv: loserEpriv,
      })

      if (putData.err) {
        return { err: 'error.cant_set_winner_for_this_transaction' }
      }
      /* Update local data to update UI */
      this.setLocalTransactionBySoul(transactionSoul, {
        state: TRANSACTION_STATE.DONE_SET_WINNER,
      })
      return { data: putData, ok: 1 }
    },
    /* Call when either buyer or seller get (back) money */
    async getMoney(transactionSoul: string, side: TRANSACTION_SIDE) {
      const gun = useGun()
      const appGun = useGunDb()
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn || !authStore.userRef) {
        return { err: 'error.not_logged_in' }
      }
      debugger
      const transactionRef = gun.get(transactionSoul)
      const {
        buyer: buyerLink,
        seller: sellerLink,
        meditator: meditatorLink,
        product: productLink,
        BCEpriv: encryptedBCEpriv,
      } = await useOnceToPromise(transactionRef)

      let winnerLink, loserLink
      if (side == TRANSACTION_SIDE.BUYER) {
        winnerLink = buyerLink
        loserLink = sellerLink
      } else {
        winnerLink = sellerLink
        loserLink = buyerLink
      }
      const winnerSoul = getGunNodeSoul(winnerLink)
      const loserSoul = getGunNodeSoul(loserLink)
      const productSoul = getGunNodeSoul(productLink)
      const winner = await useOnceToPromise(gun.get(winnerSoul))
      const loser = await useOnceToPromise(gun.get(loserSoul))
      const product = await useOnceToPromise(gun.get(productSoul))

      if (!loser.alias || winner.alias != authStore.getAlias) {
        return { err: 'error.cant_proceed_this_transaction' }
      }
      const winnerSeaPair = authStore.userInfo.sea

      const winnerKeyPair = await parseTransactionKeyPair(winner, winnerSeaPair)
      const loserKeyPair = await parseTransactionKeyPair(loser)

      const sharedPassphrase = await getSharedSecretPassphrase(loser.alias)
      const loserPrivString = await SEA.decrypt(
        encryptedBCEpriv,
        sharedPassphrase
      )
      const loserPriv = ec.keyFromPrivate(loserPrivString)
      const sharedSecret = winnerKeyPair.derive(loserKeyPair.getPublic()) // d_c
      const BCEprivString = winnerKeyPair
        .getPrivate()
        .add(sharedSecret)
        .add(loserPriv.getPrivate()) //d_b + d_c + d_a
      const BCPair = ec.keyFromPrivate(BCEprivString)
      const BCEpriv = BCPair.getPrivate().toString(16)
      const BCEPub = BCPair.getPublic().encode('hex') // remove 04 prefix
      const BCAddress = getBCAddress(BCEPub)
      const BCAddress2 = await SEA.decrypt(winner.BCAddress, winnerSeaPair)

      const accounts = await web3.eth.requestAccounts()
      const account = accounts[0]
      const amount = getExchangeYenToWei(product.price)

      const { err, hash } = await makeSignedTransaction(
        account,
        BCEpriv,
        amount
      )
      if (err || !hash) {
        return { err: 'error.cant_proceed_this_transaction' }
      }

      const putData = await usePutToPromise(gun.get(transactionSoul), {
        state: TRANSACTION_STATE.DONE_GET_MONEY,
      })
      if (putData.err) {
        return { err: 'error.cant_proceed_this_transaction' }
      }
      /* Update local data to update UI */
      this.setLocalTransactionBySoul(transactionSoul, {
        state: TRANSACTION_STATE.DONE_GET_MONEY,
      })
      return { data: hash, ok: 1 }
    },
    /* Called when user want to cancel the transaction. Can depend on the state of transaction */
  },
})
