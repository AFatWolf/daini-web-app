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

      const linkProductToOwner = () => {
        const productRef = gun.get(WAREHOUSE_KEY).get(product.id)
        debugger
        // Link product Reference to user
        userRef.get(WAREHOUSE_KEY).set(productRef, (ack) => {
          if (ack.error) {
            console.log('Cannot put item in owner.', ack)
          } else {
            console.log('Put item in owner.', ack)
          }
        })
      }

      this.loading.sellProduct = true
      gun.get(WAREHOUSE_KEY).put(putProduct, (ack) => {
        if (ack.err) {
          console.log(ack)
        } else {
          generateKeys()
          const soul = ack['#']
          console.log('Ack: ', ack)
          linkProductToOwner()
          console.log('Sell successfully')
        }
        this.loading.sellProduct = false
      })
    },
  },
})
