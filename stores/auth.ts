import { defineStore } from 'pinia'
import { ILogInParams, ISignUpParams } from '@/interfaces/auth'
import { useGun } from '@gun-vue/composables'

interface IAuthState {
  isLoggedIn: boolean
  // TODO: replace with IUser
  userInfo: Object
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    isLoggedIn: false,
    userInfo: {},
  }),
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
      user.auth(body.username, body.password, (ack) => {
        console.log(ack)
      })
    },
  },
})
