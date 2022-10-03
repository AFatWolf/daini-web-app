export enum TRANSACTION_STATE {
  // Pre-transaction
  GENERATING_ALL_SIDES_KEY_PAIRS = 'generating-all-sides-key-pairs',
  GENERATING_PARTICIPATORS_COMMON_SECRET = 'generating-paricipators-common-secret',
  GENERATING_DEPOSIT_SC_SHARED_PUBLIC_KEY = 'generating-deposit-sc-shared-public-key',
  SENDING_ENCRYPTED_PRIVATE_KEY = 'sending-encrypted-private-key',
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
