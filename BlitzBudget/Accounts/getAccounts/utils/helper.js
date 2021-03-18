const Helper = () => {};

const constants = require('../constants/constant');

Helper.prototype.createParameters = (walletId) => ({
  TableName: constants.EU_WEST_ONE,
  KeyConditionExpression: 'pk = :walletId and begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':walletId': walletId,
    ':items': 'BankAccount#',
  },
  ProjectionExpression:
      'bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type, account_sub_type',
});

// Export object
module.exports = new Helper();
