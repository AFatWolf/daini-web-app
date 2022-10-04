/**
 * 
 * @param nodeRef format: { _: {...}, `productId`: {#: productSoul}}
 * @returns productSoul
 */
export const getProductGunSoul = (nodeRef) => {
  for (const key of Object.keys(nodeRef)) {
    if (key === '_') continue
    const obj = nodeRef[key] // key == id of the product
    return obj ? obj['#'] || false : false
  }
}
