import { keccak256 } from 'js-sha3'

/**
 * 
 * @param publicKey Hex-encoded public key
 * @returns 
 */
export const getBCAddress = (publicKey) => {
    return '0x' +
    keccak256(Buffer.from(publicKey.slice(2), 'hex')) // remove the 04 prefix
      .slice(64 - 40)
      .toString()
}