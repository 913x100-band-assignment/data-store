const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const usersTable = process.env.USERS_TABLE;

exports.handler = async event => {
  const body = JSON.parse(event.body || '{}');
  const param = {
    TableName: usersTable,
    Item: {...body}
  }

  try {
    await docClient.put(param).promise();

    return { 
      statusCode: 200, 
      body: JSON.stringify(body) 
    };
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }
};