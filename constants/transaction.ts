// DONE + function name in transaction
export enum TRANSACTION_STATE {
  // Pre-transaction
  // Notation: DONE_ + function in transactions
  DONE_BUY = 'done-buy',
  DONE_ACCEPT_TO_SELL = 'done-accept-to-sell',
  DONE_REFUSE_TO_SELL = 'done-refuse-to-sell',
DONE_PAY = 'pay',
  DONE_CANCEL = 'done-cancel',
  // Good end: buyer received goods and seller received money
  DONE_SET_DELIVERED_GOODS = 'done-set-delivered-goods',
  DONE_SET_RECEIVED_GOODS = 'done-set-received-goods',
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
  PRODUCT = 'product',
  BUYER_EPRIV = 'buyerEpriv',
  SELLER_EPRIV = 'sellerEpriv',
  BLOCKCHAIN_PRIVATE_KEY = 'BCEpriv',
}

export const TRANSACTION_STATE_SEQUENCE = {
  [TRANSACTION_STATE.DONE_BUY]: 100,
  [TRANSACTION_STATE.DONE_ACCEPT_TO_SELL] : 200,
  [TRANSACTION_STATE.DONE_REFUSE_TO_SELL] : 50,
  [TRANSACTION_STATE.DONE_PAY] : 300,
  [TRANSACTION_STATE.DONE_CANCEL] : 50,
  // Good end: buyer received goods and seller received money
  [TRANSACTION_STATE.DONE_SET_DELIVERED_GOODS] : 400,
  [TRANSACTION_STATE.DONE_SET_RECEIVED_GOODS] : 400,
  // Bad end: one side wins the bet
  [TRANSACTION_STATE.DONE_DISPUTE] :500,
  [TRANSACTION_STATE.DONE_SET_WINNER] : 600,
  [TRANSACTION_STATE.DONE_GET_MONEY] : 700,
}

//  TODO-REFACTOR
export const GAS_FEE = 21000
export const GAS_PRICE = 20000000000