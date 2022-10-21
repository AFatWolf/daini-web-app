// DONE + function name in transaction
export enum TRANSACTION_STATE {
  // Pre-transaction
  DONE_BUY,
  
  // During transaction
  PAYING = 'paying',
  DELIVERING = 'delivering',
  RECEIVING = 'receiving',
  // Ending transaction
  CHECKING_EVIDENCES = 'checking-evidences', // meditator checking evidences
  // Good end: buyer received goods and seller received money
  // Bad end: one side wins the bet
  DONE = 'done',
}

export enum TRANSACTION_SIDE {
  BUYER,
  SELLER,
  MEDITATOR,
}