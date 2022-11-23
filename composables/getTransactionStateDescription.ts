import { TRANSACTION_STATE } from '@/constants/transaction'

export const getTransactionStateDescription = (state, t) => {
  let message
  switch (state) {
    case TRANSACTION_STATE.DONE_BUY:
      message = 'transaction.description.done_buy'
      break
    case TRANSACTION_STATE.DONE_ACCEPT_TO_SELL:
      message = 'transaction.description.done_accept_to_sell'
      break
    case TRANSACTION_STATE.DONE_REFUSE_TO_SELL:
      message = 'transaction.description.done_refuse_to_sell'
      break
    case TRANSACTION_STATE.DONE_PAY:
      message = 'transaction.description.done_pay'
      break
    case TRANSACTION_STATE.DONE_CANCEL:
      message = 'transaction.description.done_cancel_order'
      break
    case TRANSACTION_STATE.DONE_SET_DELIVERED_GOODS:
      message = 'transaction.description.done_set_delivered_goods'
      break
    case TRANSACTION_STATE.DONE_SET_RECEIVED_GOODS:
      message = 'transaction.description.done_set_received_goods'
      break
    case TRANSACTION_STATE.DONE_DISPUTE:
      message = 'transaction.description.done_dispute'
      break
    case TRANSACTION_STATE.DONE_SET_WINNER:
      message = 'transaction.description.done_set_winner'
      break
    case TRANSACTION_STATE.DONE_GET_MONEY:
      message = 'transaction.description.done_get_money'
      break
  }
  return t(message)
}
