import { TRANSACTION_STATE } from '~~/constants/transaction'

export interface ISide {
  // Side info
  alias?: string
  epub?: string
  epriv?: string // encrypted
}

export interface ITransaction {
  id: string
  // Side info
  seller?: ISide
  buyer?: ISide
  meditator?: ISide
  // Product Info
  product?: {
    name?: string
    soul: string
    quantity?: number
    price?: number
  }
  state: TRANSACTION_STATE
}

export interface IOrder {
  soul: string
  name?: string
  quantity?: number
  price?: number
  sellerAlias: string
  meditatorAlias: string
}
