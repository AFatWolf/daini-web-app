import { SEA } from '@gun-vue/composables'
import { ec as EC } from 'elliptic'

const ec = new EC('secp256k1')

export const parseTransactionKeyPair = async (
  stringifiedKeyPair,
  userSeaPair = null
) => {
  const epub = ec.keyFromPublic(stringifiedKeyPair.epub, 'hex') // Full KeyPair object (with privKey null)
  if (!userSeaPair) return epub

  let epriv = stringifiedKeyPair.epriv
  epriv = ec.keyFromPrivate(
    await SEA.decrypt(stringifiedKeyPair.epriv, userSeaPair)
  )

  return epriv
}
