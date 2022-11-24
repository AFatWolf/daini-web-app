import { defineStore } from 'pinia'
import { ILogInParams, ISignUpParams } from '@/interfaces/auth'
import { useGun } from '@gun-vue/composables'
import { USERS_KEY } from '@/constants/common'

interface IAuthState {
  // TODO: replace with IUser
  userInfo: Object
  // user Reference in GUN DB
  userRef: Object
  user: Object
  isLoggedIn: boolean
  loading: {
    userInfo: boolean
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    userInfo: {},
    userRef: {},
    user: {},
    isLoggedIn: false,
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
      // get Alias
      return useGun().user().is?.alias || 'anon'
    },
    getAlias(state) {
      return state.userInfo
        ? useTrimStart(state.userInfo.soul, '~')
        : this.getUsername()
    },
    getUserRef: (state) => state.userRef || null,
    // isLoggedIn: (state) => {
    //   return state.user?.is
    // },
  },
  actions: {
    recall() {
      const gun = useGun()
      const user = gun.user().recall({ sessionStorage: true }, (ack) => {
        this.userInfo = ack
        this.isLoggedIn = true
        this.fetchUserRef()

        console.log(ack)
        console.log('userinfo', this.userInfo)
      })
      return user
    },
    signUp(body: ILogInParams) {
      const gun = useGun()
      const user = gun.user()

      user.create(body.username, body.password, (ack) => {
        console.log(ack)
      })
    },
    logIn(body: ISignUpParams) {

      const gun = useGun()
      const onLogin = (ack) => {
        this.loading.userInfo = false
        this.userInfo = ack
        this.isLoggedIn = true
        this.fetchUserRef()

        console.log(ack)
        console.log('userinfo', this.userInfo)
      }

      const user = gun.user().recall({ sessionStorage: true })
      this.loading.userInfo = true
      user.auth(body.username, body.password, onLogin)
    },
    logOut() {
      useGun().user().leave()
      this.isLoggedIn = false
    },
    fetchUserRef() {
      this.userRef = this.userInfo['$']
      this.user = useGun().user()
    },
    fetchPublicCurrentUserRef(key: string = '') {
      const alias = this.getAlias
      return this.fetchPublicUserRef(alias, key)
    },
    fetchPublicUserRef(alias: string, key: string = '') {
      const appGun = useGunDb()
      if (!key) return appGun.get(USERS_KEY).get(alias)
      return appGun.get(USERS_KEY).get(key + '-' + alias)
    },
  },
})
