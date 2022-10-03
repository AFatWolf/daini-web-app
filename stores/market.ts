import { defineStore } from 'pinia'
import { ILogInParams, ISignUpParams } from '@/interfaces/auth'
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
          this.products.push(data)
        })
    },
  },
})
