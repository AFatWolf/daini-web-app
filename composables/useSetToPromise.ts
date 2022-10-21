// TODO-TEST
export const useSetToPromise = (gunRef, arg) => {
    return new Promise((resolve, reject) => {
      gunRef.set(arg).once((data) => {
        if (!data) return reject({ err: 'error.no_data_returned' })
        if (!data || data.error) return reject({err: 'error.execution'})
        resolve(data)
      })
    })
  }
  