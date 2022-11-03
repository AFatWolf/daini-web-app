// DONE + function name in transaction
export enum TRANSACTION_STATE {
  // Pre-transaction
  // Notation: DONE_ + function in transactions
  DONE_BUY = 'done-buy',
  DONE_ACCEPT_TO_SELL = 'done-accept-to-sell',
  DONE_REFUSE_TO_SELL = 'done-refuse-to-sell',
  DONE_PROCEED_TO_BUY = 'done-proceed-to-buy',
  DONE_ACCEPT = 'do-accept',
  DONE_PAY = 'pay',
  
  // During transaction
  PAYING = 'paying',
  DELIVERING = 'delivering',
  RECEIVING = 'receiving',
  // Ending transaction
  CHECKING_EVIDENCES = 'checking-evidences', // meditator checking evidences
  // Good end: buyer received goods and seller received money
  // Bad end: one side wins the bet
  DONE_DISPUTE = 'done-dispute',
  DONE_SET_WINNER = 'done-set-winner',
  DONE_GET_MONEY = 'done-get-money',
}

export enum TRANSACTION_SIDE {
  BUYER,
  SELLER,
  MEDITATOR,
}

export enum TRANSACTION_FIELDS {
  BUYER = 'buyer',
  SELLER = 'seller',
  MEDITATOR = 'meditator',
  BUYER_EPRIV = 'buyerEpriv',
  SELLER_EPRIV = 'sellerEpriv',
  BLOCKCHAIN_PRIVATE_KEY = 'BCEpriv'
}

//  TODO-REFACTOR
export const GAS_FEE = 21000
export const GAS_PRICE = 20000000000