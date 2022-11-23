export default {
  app_name: 'DAINI',
  tag_line_1: 'Buy safe. Sell safe. ',
  tag_line_2: "No intermediary. That's DAINI",
  tag_line_3: "Buy safe. Sell safe.\nThat's DAINI",
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
      success: 'Publish successfully.',
    },
    left: 'left',
    price: 'Price',
  },
  market: {
    title: 'Market, where you can buy stuff',
    description: 'where you finds and buys goods',
    sold_out: 'Sold Out',
  },
  warehouse: {
    title: 'Your Sold List',
    description: 'where you sells your gooods',
    nothing: 'You are not sellling any products right now.',
    sell: 'Sell now!',
  },
  transaction: {
    title: 'Transactions',
    nothing: 'You did not have any orders ongoing.',
    go_to_market: 'Go To Market',
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
      cancel_order: 'Cancel Order',
      delivered_goods: 'Delivered Goods',
      received_goods: 'Received Goods',
      buyer_wins: 'Buyer wins',
      seller_wins: 'Seller wins',
      dispute: 'Dispute',
      get_money: 'Get Money',
      get_money_back: 'Get Money Back',
    },
    description: {
      done_buy:
        'The order has been sent. Please wait for the seller to confirm your order.',
      done_accept_to_sell:
        'The order has been accepted.',
      done_pay:
        'The order has been paid.',
      done_dispute:
        'One of the sides has disputed the order. The order will now be put on hold and waited for the judgement of the meditator.',
      done_set_delivered_goods:
        'The goods has been on the way to the buyer.',
      done_set_received_goods:
        'The goods has been received by the buyer successfully.',
      done_set_winner:
        'Winner of the dispute has been chosen. The winner will have a button to receive the money.',
      done_get_money:
        'The money of the order has been taken successfully.',
      done_cancel_order: 'The order has been canceled.',
      done_refuse_to_sell:
        'The order has been refused by the seller.',
    },
    state: 'State',
  },
  notification: {
    transaction: {
      done_accept_to_sell:
        'Sell successfully. Please wait for your customer to pay for your item.',
      done_pay:
        'Pay successfully. Please keep in mind that you will have to pay additional fee for the transaction fee used.\nThe seller will deliver the goods to you within 1 week. Please wait patiently.',
      done_dispute:
        'Dispute successfully.\nThe meditator will now choose which side get the money back. Please wait patiently.',
      done_set_delivered_goods:
        'Success. Your customer will be notified that the goods has been delivered.',
      done_set_received_goods:
        'Success. Your seller will be relieved that you received the goods.',
      done_set_winner:
        'Choose successfully.\nThe winner can now receive the money back.',
      done_get_money:
        'Get money successfully.\nYour money will be transferred to your Blockchain address. Blockchain transaction will take time to execute. Please wait patiently.',
      done_cancel_order: 'Cancel order successlly.',
      done_refuse_to_sell:
        'Refused to sell.\nThe customer of the order will be informed of the refusal.',
    },
    market: {
      buy_success:
        'Buy successfully.\nPlease wait for the seller to accept your order.',
    },
  },
  error: {
    execution: 'Execution fail',
    no_data_returned: 'No data returned',

    not_logged_in:
      'You are not logged in. Please log in to execute this action',

    no_product: 'Cannot find product.',
    no_product_left: 'Theres no item left for this product.',
    cant_buy_product: 'Cannot buy product. Please try again a moment later.',

    cant_accept_this_transaction:
      'Cannot accept this transaction. Please try again a moment later',
    cant_refuse_this_transaction:
      'Cannot refuse this transaction. Please try again a moment later.',
    cant_proceed_this_transaction:
      'Cannot proceed with this transaction. Please try again a moment later',
    cant_cancel_this_transaction:
      'Cannot cancel this transaction. Please try again a moment later.',
    cant_fetch_transactions:
      "Cannot find your orders' data. Please try again in a few minutes.",
    cant_dispute_this_transaction:
      'Cannot dispute this transaction. Plesae try again in a few minutes.',
    cant_set_delivered_this_transaction:
      'Cannot notify customer. Please try again in a few minutes.',
    cant_set_received_this_transaction:
      'Cannot notify seller. Please try again in a few minutes.',
    something_is_wrong: 'Something is wrong.',
  },
}
