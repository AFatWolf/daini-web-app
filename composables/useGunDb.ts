import { DATABASE_KEY } from '@/constants/common'
import { useGun } from '@gun-vue/composables'

export const useGunDb = () => {
  const gun = useGun()
  return gun.get(DATABASE_KEY)
}
