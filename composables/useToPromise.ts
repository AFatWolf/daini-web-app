export const useToPromise = (func, ...args) => {
  console.log(func, ...args)
  return new Promise((resolve, reject) => {
    func((data) => {
      if (!data) return reject({ err: 'No data returned' })
      if (!data || data.error) return reject(data)
      resolve(data)
    })
  })
}
