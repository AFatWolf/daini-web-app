/**
 *
 * @param nodeRef format: {_: {#: soul, >: ...}}
 * @returns soul
 */
export const getGunNodeSoul = (nodeRef) => {
  if (!nodeRef) return false
  if (nodeRef._) return nodeRef._['#']
  if (nodeRef['#']) return nodeRef['#']
  return false
}
