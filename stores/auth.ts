import { defineStore } from 'pinia'
import { ILogInParams, ISignUpParams } from '@/interfaces/auth'
import { useGun } from '@gun-vue/composables'
import { findLastKey } from 'lodash'

interface IAuthState {
  isLoggedIn: boolean
  // TODO: replace with IUser
  userInfo: Object
  loading: {
    userInfo: boolean
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    isLoggedIn: false,
    userInfo: {},
    loading: {
      userInfo: false,
    },
  }),
  getters: {
    /**
     *
     * @returns User's SEA keys pairs: {epriv, epub, priv, pub}
     */
    getSeaKeys() {
      return this.userInfo.sea
    },
  },
  actions: {
    signUp(body: ILogInParams) {
      const gun = useGun()
      const user = gun.user()

      user.create(body.username, body.password, (ack) => {
        console.log(ack)
      })
    },
    logIn(body: ISignUpParams) {
      const gun = useGun()
      const user = gun.user()

      this.loading.userInfo = true
      user.auth(body.username, body.password, (ack) => {
        this.loading.userInfo = false
        this.isLoggedIn = true
        this.userInfo = ack
        console.log(ack)
        console.log('userinfo', this.userInfo)
      })
    },
  },
})
