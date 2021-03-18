const FetchWallet = () => {};

const constants = require('../constants/constant');

/*
 * Wallet data
 */
FetchWallet.prototype.getWalletData = async function getWalletData(
  userId,
  walletId,
  docClient,
) {
  function organizeRetrivedItems(data) {
    console.log('data retrieved - Wallet %j', JSON.stringify(data));
    if (data.Item) {
      const item = data.Item;
      item.walletId = data.Item.sk;
      item.userId = data.Item.pk;
      delete item.sk;
      delete item.pk;
    }
  }

  function createParameter() {
    return {
      AttributesToGet: [
        'currency',
        'total_asset_balance',
        'total_debt_balance',
        'wallet_balance',
      ],
      TableName: constants.TABLE_NAME,
      Key: {
        pk: userId,
        sk: walletId,
      },
    };
  }

  console.log(
    'fetching the wallet information for the user %j',
    userId,
    ' with the wallet ',
    walletId,
  );
  const params = createParameter();

  // Call DynamoDB to read the item from the table
  const response = await docClient.get(params).promise();

  organizeRetrivedItems(response);
  return ({
    Wallet: response,
  });
};

FetchWallet.prototype.getWalletsData = async function getWalletsData(
  userId,
  docClient,
) {
  function organizeRetrivedItems(data) {
    console.log('data retrieved - Wallet %j', data.Count);
    if (data.Items) {
      Object.keys(data.Items).forEach((walletObj) => {
        const wallet = walletObj;
        wallet.walletId = walletObj.sk;
        wallet.userId = walletObj.pk;
        delete wallet.sk;
        delete wallet.pk;
      });
    }
  }

  function createParameter() {
    return {
      TableName: 'blitzbudget',
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':pk': userId,
        ':items': 'Wallet#',
      },
      ProjectionExpression:
        'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance',
    };
  }

  const params = createParameter();

  // Call DynamoDB to read the item from the table
  const response = await docClient.query(params).promise();

  organizeRetrivedItems(response);
  return {
    Wallet: response.Items,
  };
};

// Export object
module.exports = new FetchWallet();
