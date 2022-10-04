import { defineStore } from 'pinia'
import { useGun } from '@gun-vue/composables'
import { IProduct } from '@/interfaces/product'
import { WAREHOUSE_KEY } from '~~/constants/common'
import { useAuthStore } from './auth'

interface IWarehouseState {
  products: IProduct[]
  souls: string[]
  loading: {
    fetchWarehouse: boolean
  }
}

export const useWarehouseStore = defineStore('warehouse', {
  state: (): IWarehouseState => ({
    products: [],
    souls: [],
    loading: {
      fetchWarehouse: false,
    },
  }),
  getters: {
    getProductList: (state) => state.products || [],
    getProductBySoul: (state) => {
      return (soul) => {
        const index = useFindIndex(state.souls, (_soul) => _soul === soul)

        return index !== -1 ? state.products[index] : null
      }
    },
  },
  actions: {
    fetchProducts() {
      const authStore = useAuthStore()
      const userRef = authStore.getUserRef
      const gun = useGun()

      if (!userRef) return

      userRef
        .get(WAREHOUSE_KEY)
        .map()
        .once((data) => {
          console.log('Warehouse:', data)

          if (typeof data === 'object' && data) {
            const soul = getProductGunSoul(data)

            if (!soul) return

            this.souls.push(soul)
            this.products.push(data)
          }
        })
    },
  },
})
