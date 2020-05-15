// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});
var sns = new AWS.SNS();

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let fromSns = isNotEmpty(event.Records);
    let pk = fromSns ? event.Records[0].Sns.Subject : event['body-json'].walletId;
    let sk = fromSns ? event.Records[0].Sns.Message : event['body-json'].itemId;
    console.log( 'pk ', pk, ' sk ', sk);
    await deleteOneItem(pk, sk).then(function(result) {
       console.log("successfully deleted the item");
    }, function(err) {
       throw new Error("Unable to delete the item " + err);
    });
    
    if(fromSns) {
        await publishToResetAccountsSNS(sk).then(function(result) {
           console.log("successfully published the message with walletId %j", );
        }, function(err) {
           throw new Error("Unable to delete the item " + err);
        });
    }
        
    return event;
};


function deleteOneItem(pk, sk) {
    console.log('user Id selected for deletion is ' + pk);
    
    var params = {
        "TableName": 'blitzbudget', 
        "Key" : {
            "pk": pk,
            "sk": sk 
        }
    }
        
    return new Promise((resolve, reject) => {
        DB.delete(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve({ "success" : data});
          }
        });
    });
    
}

function publishToResetAccountsSNS(item) {
    var params = {
        Message: item,
        MessageAttributes: {
            "delete_all_items_in_wallet": {
                "DataType": "String",
                "StringValue": "execute"
            }
        },
        TopicArn: 'arn:aws:sns:eu-west-1:064559090307:ResetAccountSubscriber'
    };
    
    return new Promise((resolve, reject) => {
        sns.publish(params,  function(err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                resolve( "Reset account to SNS published");
            }
        }); 
    });
}

function  isEmpty(obj) {
  // Check if objext is a number or a boolean
  if(typeof(obj) == 'number' || typeof(obj) == 'boolean') return false; 
  
  // Check if obj is null or undefined
  if (obj == null || obj === undefined) return true;
  
  // Check if the length of the obj is defined
  if(typeof(obj.length) != 'undefined') return obj.length == 0;
   
  // check if obj is a custom obj
  for(let key in obj) {
        if(obj.hasOwnProperty(key))return false;
    }

  return true;
}

function isNotEmpty(obj) {
    return !isEmpty(obj)
}