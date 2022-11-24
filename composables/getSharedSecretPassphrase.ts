import { useAuthStore } from "@/stores/auth"
import { useGun, SEA } from "@gun-vue/composables"

export const getSharedSecretPassphrase = async (otherAlias) => {
    const authStore = useAuthStore()
    const gun = useGun()
    if(!authStore.isLoggedIn) return { err: 'User is currently not logged in.' }
    const sea = authStore.userInfo.sea
    const otherSea = await useOnceToPromise(gun.get('~' + otherAlias)) // Buyer A's public key to encrypt
    const secret = await SEA.secret(otherSea.epub, sea)
    return secret
    // return new Promise((resolve, reject) => {
    //     gunRef.once((data) => {
    //       if (!data) return reject({ err: 'error.no_data_returned' })
    //       if (!data || data.error) return reject({err: 'error.execution'})
    //       resolve(data)
    //     })
    //   })
}