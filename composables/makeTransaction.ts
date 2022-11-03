import Web3 from 'web3'
import { GAS_FEE } from '@/constants/transaction'

/**
 *
 * @param destinationAddress
 * @param eth 
 */
export const makeTransaction = async (
  destinationAddress,
  eth
) => {
  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545')
  const accounts = await web3.eth.requestAccounts()
  const account = accounts[0]
  const nonce = await web3.eth.getTransactionCount(account, 'latest')
  const transaction = {
    from: account,
    to: destinationAddress,
    value: eth,
    gas: GAS_FEE,
    nonce: nonce,
  }
  return new Promise(async (resolve, reject) => {
    web3.eth.sendTransaction(transaction, (err, res) => {
      if (err) resolve({ err })
      resolve({ hash: res })
    })
  })
}
