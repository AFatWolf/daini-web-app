import { useAuthStore } from "@/stores/auth"
import { useGun, SEA } from "@gun-vue/composables"

export const getSharedSecretPassphrase = async (otherAlias) => {
    const authStore = useAuthStore()
    const gun = useGun()
    if(!authStore.isLoggedIn) return { err: 'User is currently not logged in.' }
    const sea = authStore.userInfo.sea
    const otherSea = await useOnceToPromise(gun.user(otherAlias)) // Buyer A's public key to encrypt
    const secret = await SEA.secret(otherSea.epub, sea)
    return secret
}