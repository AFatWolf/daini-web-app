/**
 * 
 * @param nodeRef format: {_: {#: soul, >: ...}}
 * @returns soul
 */
export const getGunNodeSoul = (nodeRef) => nodeRef && nodeRef._ ? nodeRef._['#'] : false