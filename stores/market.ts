import { defineStore } from 'pinia'
import { useGun } from '@gun-vue/composables'
import { IProduct } from '@/interfaces/product'
import { WAREHOUSE_KEY } from '~~/constants/common'

interface IMarketState {
  products: IProduct[]
  loading: {
    fetchProducts: boolean
  }
}

export const useMarketStore = defineStore('market', {
  state: (): IMarketState => ({
    products: [],
    loading: {
      fetchProducts: false,
    },
  }),
  getters: {
    getProductList: (state) => state.products || [],
  },
  actions: {
    async fetchProducts() {
      if (this.loading.fetchProducts) return
      const gun = useGunDb()
      // Reset
      this.products = []
      gun
        .get(WAREHOUSE_KEY)
        .map()
        .once((data) => {
          if (typeof data === 'object' && data) this.products.push(data)
        })
    },
    fetchProductWithSoul(soul) {
      const gun = useGun()
      gun.get(soul)
    },
    setLocalProductWithSoul(soul, data) {
      let idx = useFindIndex(this.products, (p) => getGunNodeSoul(p) === soul)
      if (idx === -1) return
      useForEach(Object.keys(data), (key) => {
        this.products[idx][key] = data[key]
      })
    },
  },
})
