import { ITEM_STATUS, PRODUCT_STATUS } from '@/constants/product'

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
  status?: ITEM_STATUS
  // JSON for keyPair
  keyPairJSON?: string
}
