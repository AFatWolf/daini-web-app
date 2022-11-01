import Web3 from 'web3'

/**
 *
 * @param destinationAddress
 * @param sourcePrivateKey
 * @param eth
 */
export const makeSignedTransaction = async (
  destinationAddress,
  sourcePrivateKey,
  eth
) => {
  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545')
  const { address: account } =
    web3.eth.accounts.privateKeyToAccount(sourcePrivateKey)
  const nonce = await web3.eth.getTransactionCount(account, 'latest')
  const transaction = {
    to: destinationAddress,
    value: eth,
    gas: 21000,
    nonce: nonce,
  }
  const signedTransaction = await web3.eth.accounts.signTransaction(
    transaction,
    sourcePrivateKey
  )
  return new Promise(async (resolve, reject) => {
    web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
      (err, res) => {
        if (err) resolve({ err })
        resolve(res)
      }
    )
  })
}
