function FetchWallet() {}

const walletParameter = require('../create-parameter/wallet');
const util = require('../utils/util');

FetchWallet.prototype.getWallet = async (userId, docClient) => {
  const params = walletParameter.createParameter(userId);

  // Call DynamoDB to read the item from the table
  const response = await docClient.query(params).promise();
  return util.nameKeysAppropriately(response);
};

// Export object
module.exports = new FetchWallet();
