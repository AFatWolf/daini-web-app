import { defineStore } from 'pinia'
import { IProduct, IItem } from '@/interfaces/product'
import { WAREHOUSE_KEY } from '~~/constants/common'
import { ec as EC } from 'elliptic'
import { useAuthStore } from '@/stores/auth'

const ec = new EC('secp256k1')

interface IProductState {
  product: IProduct
  loading: {
    getProduct: boolean
    sellProduct: boolean
  }
}

export const useProductStore = defineStore('item-stock', {
  state: (): IProductState => ({
    product: { items: [] },
    loading: {
      getProduct: false,
      sellProduct: false,
    },
  }),
  getters: {
    getItemsList: (state) => {
      return state.product.items || []
    },
  },
  actions: {
    getProduct(id: string) {
      const gun = useGunDb()
      this.loading.getProduct = true
      gun
        .get(WAREHOUSE_KEY)
        .get(id)
        .on((data) => {
          this.loading.getProduct = false
        })
    },
    sellProduct(product: IProduct) {
      const gun = useGunDb()
      const authStore = useAuthStore()
      const userRef = authStore.getUserRef

      if (!userRef) return

      // Initialize product
      product.id = product.name
      product.createdTime = new Date().toISOString()
      product.totalQuantity = Number(product.totalQuantity)
      product.leftQuantity = product.totalQuantity
      const putProduct = {
        [product.id]: product,
      }

      // Generate key pairs for each items
      const generateKeys = (callback?: () => {}) => {
        for (let i = 0; i < product.totalQuantity; i++) {
          const keyPair = ec.genKeyPair()
          const item = {
            keyPairJSON: JSON.stringify(keyPair),
          }
          gun.get(WAREHOUSE_KEY).get(product.id).get('items').set(item)
          if (callback) callback()
        }
      }

      this.loading.sellProduct = true
      const productRef = gun.get(WAREHOUSE_KEY).put(putProduct, (ack) => {
        if (ack.err) {
          console.log(ack)
        } else {
          console.log('Sell successfully')
          generateKeys()
        }
        this.loading.sellProduct = false
      })

      // Link product Reference to user
      userRef.get(WAREHOUSE_KEY).set(product)
    },
  },
})
