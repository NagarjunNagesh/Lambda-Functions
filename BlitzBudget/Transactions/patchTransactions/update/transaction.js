const UpdateTransaction = () => {};

const parameters = require('../utils/parameter');
const constants = require('../constants/constant');
const helper = require('../utils/helper');

async function updatingTransactions(event, docClient) {
  function createParameters() {
    let updateExp = 'set';
    const expAttrVal = {};
    const expAttrNames = {};

    if (helper.isEmpty(event['body-json'])) {
      return undefined;
    }

    for (let i = 0, len = parameters.length; i < len; i++) {
      const prm = parameters[i];

      // If the parameter is not found then do not save
      if (helper.isNotEmpty(event['body-json'][prm.prmName])) {
        // Add a comma to update expression
        if (helper.includesStr(updateExp, '#variable')) {
          updateExp += ',';
        }

        console.log(`param name - ${event['body-json'][prm.prmName]}`);

        updateExp += ` #variable${i} = :v${i}`;
        expAttrVal[`:v${i}`] = event['body-json'][prm.prmName];
        expAttrNames[`#variable${i}`] = prm.prmValue;
      }
    }

    console.log(
      ' update expression ',
      JSON.stringify(updateExp),
      ' expression attribute value ',
      JSON.stringify(expAttrVal),
      ' expression Attribute Names ',
      JSON.stringify(expAttrNames),
    );
    if (helper.isEmpty(expAttrVal)) {
      return undefined;
    }

    updateExp += ', #update = :u';
    expAttrVal[':u'] = new Date().toISOString();
    expAttrNames['#update'] = 'updated_date';

    return {
      TableName: constants.TABLE_NAME,
      Key: {
        pk: event['body-json'].walletId,
        sk: event['body-json'].transactionId,
      },
      UpdateExpression: updateExp,
      ExpressionAttributeNames: expAttrNames,
      ExpressionAttributeValues: expAttrVal,
      ReturnValues: 'ALL_NEW',
    };
  }

  const params = createParameters();

  console.log('Updating an item...');
  const response = await docClient.update(params).promise();
  return {
    Transaction: response,
  };
}

UpdateTransaction.prototype.updatingTransactions = updatingTransactions;
// Export object
module.exports = new UpdateTransaction();
