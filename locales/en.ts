export default {
  app_name: 'DAINI',
  tag_line_1: 'Buy safe. Sell safe. ',
  tag_line_2: "No intermediary. That's DAINI",
  login: 'Log In',
  signup: 'Sign Up',
  common: {
    name: 'Name',
    password: 'Password',
    password_confirm: 'Re-Enter Password',
    quantity: 'Quantity',
    price: 'Price',
    purchase: 'Purchase',
    view: 'View',
  },
  item: {
    sell: {
      title: "Item's Description",
      sell_item: 'Publish To Market',
      price: 'Price (yen)',
    },
    left: 'left',
    price: 'Price',
  },
  market: {
    title: 'Market, where you can buy stuff',
  },
  transaction: {
    title: 'Transactions',
    role: 'Role',
    buyer: 'Buyer',
    seller: 'Seller',
    meditator: 'Meditator',
    button: {
      accept_to_sell: 'Accept',
      refuse_to_sell: 'Refuse',
      proceed_to_buy: 'Proceed To Buy',
      pay: 'Pay',
      stop: 'Stop',
      buyer_wins: 'Buyer wins',
      seller_wins: 'Seller wins',
      dispute: 'Dispute',
      get_money: 'Get Money',
      get_money_back: 'Get Money Back',
    },
    state: 'State',
  },
  error: {
    execution: 'Execution fail',
    no_data_returned: 'No data returned',

    not_logged_in:
      'You are not logged in. Please log in to execute this action',

    no_product: 'Cannot find product.',
    cant_buy_product: 'Cannot buy product. Please try again a moment later.',

    cant_accept_this_transaction:
      'Cannot accept this transaction. Please try again a moment later',
    cant_proceed_this_transaction:
      'Cannot proceed with this transaction. Please try again a moment later',
    cant_fetch_transactions:
      "Cannot find your orders' data. Please try again in a few minutes.",

    something_is_wrong: 'Something is wrong.',
  },
}
