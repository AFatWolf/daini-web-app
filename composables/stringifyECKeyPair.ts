import { SEA } from '@gun-vue/composables'

// seaPair can also be a shared passphrase generated from secret
export const stringifyECKeyPair = async (keyPair, seaPair = null) => {
  const privKey = keyPair.getPrivate()
  const pubKey = keyPair.getPublic()
  let epriv = {},
    epub = ''
  if (seaPair) epriv = { epriv: await SEA.encrypt(privKey, seaPair) }
  epub = pubKey.encode('hex')

  return {
    epub,
    ...epriv,
  }
}
