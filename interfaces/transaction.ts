import { TRANSACTION_STATE } from '@/constants/transasction'

export interface Side {
    // Side info
}

export interface Transaction {
    // IDs of Side
    seller?: string
    buyer?: string
    meditator?: string
    // ID of item
    item?: string
    quantity?: number
    state?: TRANSACTION_STATE
  }