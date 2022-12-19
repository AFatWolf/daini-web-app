// export const DATABASE_KEY = 'test-25122000-' // test env
export const DATABASE_KEY = 'pact-20001225' // product env

export const WAREHOUSE_KEY = DATABASE_KEY + 'warehouse'

export const TRANSACTIONS_KEY = DATABASE_KEY + 'transactions'

export const USERS_KEY = DATABASE_KEY + 'daini-users'

export const HOME_ROUTE = {
  HOME: '/',
  INDEX: 'index',
  LOGIN: { name: 'login' },
  SIGNUP: { name: 'signup' },
}

export const WAREHOUSE_ROUTE = {
  INDEX: { name: 'warehouse' },
  DETAIL: 'warehouse-productSoul',
  SELL: { name: 'sell' },
}

export const MARKET_ROUTE = {
  INDEX: { name: 'market' },
}

export const TRANSACTIONS_ROUTE = {
  INDEX: { name: 'transactions' },
}

export enum GLOBAL_DIALOG {
  WARNING = 'global-dialog-warning',
}

export const WARNING_TYPE = {
  DELETE: 'delete',
}
