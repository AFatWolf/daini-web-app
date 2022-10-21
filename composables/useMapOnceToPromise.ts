import { useGun } from '@gun-vue/composables'

// TODO-TEST
export const useMapOnceToPromise = (gunRef) => {
  return new Promise(async (resolve, reject) => {
    // gunRef.once().map((data) => {
    //   if (!data) return reject({ err: 'error.no_data_returned' })
    //   if (!data || data.error) return reject({ err: 'error.execution' })
    //   resolve(data)
    // })
    
    // for avoiding duplication mapped data
    const onceRef = await useOnceToPromise(gunRef)
    if(onceRef.error) return reject({ err: 'error.execution' })
    gunRef.once().once((data) => {
      if (!data) return reject({ err: 'error.no_data_returned' })
      if (!data || data.error) return reject({ err: 'error.execution' })
      // since onceRef will be duplicated here
      if(isEqual(data, onceRef)) return
      resolve(data)
    })
  })
}
