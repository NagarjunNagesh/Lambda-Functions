const FetchCategory = () => {};

const util = require('../utils/util');
const categoryParameter = require('../create-parameter/category');

FetchCategory.prototype.getCategoryData = async (event, today, documentClient) => {
  function calculateCategory(data) {
    console.log('data retrieved - Category %j', data.Count);
    let obj;
    if (util.isNotEmpty(data.Items)) {
      data.Items.forEach((categoryObj) => {
        if (util.isEqual(categoryObj.category_type, event['body-json'].categoryType)
          && util.isEqual(categoryObj.category_name, event['body-json'].category)) {
          console.log('Found a match for the mentioned category %j', categoryObj.sk);
          obj = categoryObj;
        }
      });
    }

    if (util.isEmpty(obj)) {
      console.log('No matching categories found');
    }
    return obj;
  }

  const params = categoryParameter.createParameters(event, today);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  const categories = calculateCategory(response);

  return { Category: categories };
};

// Export object
module.exports = new FetchCategory();
