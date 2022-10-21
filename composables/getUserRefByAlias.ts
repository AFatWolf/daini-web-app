import { useGun } from '@gun-vue/composables'

/**
 * 
 * @param alias alias returned by gun.user().is
 */

export const getUserRefByAlias = async (alias) => {
    const gun = useGun()
    const user = await useOnceToPromise(gun.user().get(alias))
    debugger
    return user
}