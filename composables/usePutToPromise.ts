// TODO-TEST
export const usePutToPromise = (gunRef, arg) => {
  return new Promise((resolve, reject) => {
    let returnData
    const ref = gunRef.put(arg, (data) => {
      if (!data) return reject({ err: 'error.no_data_returned' })
      if (!data || data.error) return reject({ err: 'error.execution' })
      // resolve(data)
      returnData = data
    })
    resolve({ data: returnData, ok: 1, ref })
  })
}
