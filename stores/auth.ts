import { defineStore } from 'pinia'
import { ILogInParams, ISignUpParams } from '@/interfaces/auth'
import { useGun } from '@gun-vue/composables'

interface IAuthState {
  isLoggedIn: boolean
  // TODO: replace with IUser
  userInfo: Object
  // user Reference in GUN DB
  userRef: Object
  loading: {
    userInfo: boolean
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    isLoggedIn: false,
    userInfo: {},
    userRef: {},
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
    getUsername() {
      return this.userInfo.username || ''
    },
    getUserRef: (state) => state.userRef || null,
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
        this.userInfo.username = body.username
        console.log(ack)
        console.log('userinfo', this.userInfo)
      })
      this.fetchUserRef()
    },
    fetchUserRef() {
      const gun = useGun()
      this.userRef = gun.user(this.getUsername)
    },
  },
})
