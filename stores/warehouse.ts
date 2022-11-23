import { defineStore } from 'pinia'
import { useGun } from '@gun-vue/composables'
import { IProduct } from '@/interfaces/product'
import { WAREHOUSE_KEY } from '@/constants/common'
import { useAuthStore } from '@/stores/auth'

interface IWarehouseState {
  products: IProduct[]
  // Type: {string: IProduct}
  productsBySoul: Object
  souls: string[]
  alias: string
  loading: {
    fetchWarehouse: boolean
  }
}

export const useWarehouseStore = defineStore('warehouse', {
  state: (): IWarehouseState => ({
    products: [],
    productsBySoul: {},
    souls: [],
    alias: '',
    loading: {
      fetchWarehouse: false,
    },
  }),
  getters: {
    getProductList: (state) => {
      const souls = Object.keys(state.productsBySoul)
      return useMap(souls, (soul) => state.productsBySoul[soul] || null)
    },
    getProductBySoul: (state) => {
      return (soul) => {
        return state.productsBySoul[soul] || null
      }
    },
  },
  actions: {
    fetchProducts() {
      const authStore = useAuthStore()
      // If already fetched and set up listener
      if (!isEmpty(this.productsBySoul) && this.alias === authStore.getAlias) return

      const userRef = authStore.fetchPublicCurrentUserRef(WAREHOUSE_KEY)
      const gun = useGun()

      if (!userRef) return

      // Reset
      this.alias = authStore.getAlias
      this.souls = []
      this.productsBySoul = {}
      userRef.map().on((data) => {
        console.log('Warehouse:', data)
        if (typeof data === 'object' && data) {
          const soul = getProductGunSoul(data)

          if (!soul) return

          this.souls.push(soul)
          this.productsBySoul[soul] = data
        }
      })
    },
  },
})
