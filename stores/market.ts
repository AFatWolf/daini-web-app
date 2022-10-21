import { defineStore } from 'pinia'
import { useGun } from '@gun-vue/composables'
import { IProduct } from '@/interfaces/product'
import { WAREHOUSE_KEY } from '~~/constants/common'

interface IMarketState {
  products: IProduct[]
  loading: {
    fetchMarket: boolean
  }
}

export const useMarketStore = defineStore('market', {
  state: (): IMarketState => ({
    products: [],
    loading: {
      fetchMarket: false,
    },
  }),
  getters: {
    getProductList: (state) => state.products || [],
  },
  actions: {
    fetchProducts() {
      const gun = useGunDb()
      gun
        .get(WAREHOUSE_KEY)
        .map()
        .once((data) => {
          if(typeof data === 'object' && data)
          this.products.push(data)
        })
    },
    fetchProductWithSoul(soul) {
      const gun = useGun()
      gun.get(soul).get('items')
    }
  },
})
