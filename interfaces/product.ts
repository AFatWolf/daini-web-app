import { PRODUCT_STATUS } from '@/constants/product'

export interface IProduct {
  id?: string
  categories?: string[]
  name?: string
  description?: string
  //   medias?: Media[] // WIP
  price?: number
  createdTime?: string
  totalQuantity?: number
  status?: PRODUCT_STATUS
  // Reference (graph node id) of the next item to be sold
  // If null, then there's none left
  nextToSellItemRef?: string
  leftQuantity?: number
  items?: IItem[]
}

export interface IItem {
  // Item list will be a linked list
  nextItemRef?: string
  // JSON for keyPair
  keyPairJSON?: string
}
