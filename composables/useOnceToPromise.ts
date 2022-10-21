// TODO-TEST
export const useOnceToPromise = (gunRef) => {
  return new Promise((resolve, reject) => {
    gunRef.once((data) => {
      if (!data) return reject({ err: 'error.no_data_returned' })
      if (!data || data.error) return reject({err: 'error.execution'})
      resolve(data)
    })
  })
}
