export default {
  app_name: 'DAINI',
  tag_line_1: 'Buy safe. Sell safe. ',
  tag_line_2: "No intermediary. That's DAINI",
  tag_line_3: 'Buy safe. Sell safe. That\'s DAINI',
  login: 'Log In',
  signup: 'Sign Up',
  logout: 'Log Out',
  page: {
    home: 'Home',
    market: 'Market',
    warehouse: 'Warehouse',
    transactions: 'Transactions',
    sell: 'Sell',
    login: 'Log In',
    signup: 'Sign Up',
    logout: 'Log Out',
  },
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
      title: 'What kind of products that you want to sell?',
      form_title: "Item's Description",
      sell_item: 'Publish To Market',
      price: 'Price (yen)',
      success: 'Publish successfully.'
    },
    left: 'left',
    price: 'Price',
  },
  market: {
    title: 'Market, where you can buy stuff',
  },
  warehouse: {
    title: 'Your Sold List',
    nothing: 'You are not sellling any products right now.',
    sell: 'Sell now!',
  },
  transaction: {
    title: 'Transactions',
    role: 'Role',
    buyer: 'Buyer',
    buyer_order: 'Your Orders',
    seller_order: "Your Customers' Orders",
    meditator_order: 'Your Managing Transactions',
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
  notification: {
    transaction: {
      done_accept_to_sell: 'Sell successfully. Please wait for your customer to pay for your item.',
      done_pay: 'Pay successfully.\nThe seller will deliver the goods to you within 1 week. Please wait patiently.',
      done_dispute: 'Dispute successfully.\nThe meditator will now choose which side get the money back. Please wait patiently.',
      done_set_winner: 'Choose successfully.\nThe winner can now receive the money back.',
      done_get_money: 'Get money successfully.\nYour money will be transferred to your Blockchain address. Blockchain transaction will take time to execute. Please wait patiently.'
    },
    market: {
      buy_success: 'Buy successfully.\nPlease wait for the seller to accept your order.'
    }
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
