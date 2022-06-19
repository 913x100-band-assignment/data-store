const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const usersTable = process.env.USERS_TABLE;

exports.handler = async event => {
  try {
    const data = await docClient.scan({TableName: usersTable}).promise();
    const items = data.Items;

    return { 
      statusCode: 200, 
      body: JSON.stringify(items) 
    };
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }
};