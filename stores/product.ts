import { defineStore } from 'pinia'
import { IProduct, IItem } from '@/interfaces/product'
import { WAREHOUSE_KEY } from '@/constants/common'
import { ec as EC } from 'elliptic'
import { useAuthStore } from '@/stores/auth'
import { ITEM_STATUS } from '@/constants/product'
import { useGun } from '@gun-vue/composables'

const ec = new EC('secp256k1')

interface IProductState {
  product: IProduct
  loading: {
    fetchProduct: boolean
    sellProduct: boolean
  }
}

export const useProductStore = defineStore('item-stock', {
  state: (): IProductState => ({
    product: { items: [] },
    loading: {
      fetchProduct: false,
      sellProduct: false,
    },
  }),
  actions: {
    async fetchProductBySoul(soul: string) {
      const gun = useGun()
      this.loading.fetchProduct = true

      const productRef = gun.get(soul)
      const product = await useOnceToPromise(productRef)
      if (!product) {
        return { err: 'error.no_product' }
      }
      this.product = product
      this.loading.fetchProduct = false

      return { data: product }
    },
    sellProduct(product: IProduct) {
      const gun = useGunDb()
      const authStore = useAuthStore()
      const userRef = authStore.fetchPublicCurrentUserRef(WAREHOUSE_KEY)

      if (!userRef) return

      // Initialize product
      product.id = product.name
      product.createdTime = new Date().toISOString()
      product.totalQuantity = Number(product.totalQuantity)
      product.leftQuantity = product.totalQuantity
      product.sellerAlias = authStore.getAlias
      const putProduct = {
        [product.id]: product,
      }

      const linkProductToOwner = () => {
        const productRef = gun.get(WAREHOUSE_KEY).get(product.id)

        // Link product Reference to user
        userRef.set(productRef, (ack) => {
          if (ack.error) {
            console.log('Cannot put item in owner.', ack)
          } else {
            console.log('Put item in owner.', ack)
          }
        })
      }

      this.loading.sellProduct = true
      // TODO: Error checking 
      gun.get(WAREHOUSE_KEY).put(putProduct, (ack) => {
        if (ack.err) {
          console.log(ack)
        } else {
          linkProductToOwner()
          console.log('Sell successfully')
        }
        this.loading.sellProduct = false
      })

      return { ok: 1 }
    },
  },
})
