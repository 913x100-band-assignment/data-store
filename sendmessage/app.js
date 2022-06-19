// Copyright 2018-2020Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

const parse = AWS.DynamoDB.Converter.output

const { TABLE_NAME } = process.env;

exports.handler = async event => {
  let connections;

  try {
    connections = await ddb.scan({ TableName: TABLE_NAME, ProjectionExpression: 'connectionId, endpoint' }).promise();
  } catch (e) {
    return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(e) }; 
  }

  const records = event.Records
  const postCalls = records.map(async (record) => {
    if (record.eventName === "INSERT") {
      const user = parse({ M: record.dynamodb.NewImage })

      await Promise.all(connections.Items.map(async ({ connectionId, endpoint }) => {
        const apigwManagementApi = new AWS.ApiGatewayManagementApi({
          apiVersion: '2018-11-29',
          endpoint: endpoint
        });

        try {
          await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(user) }).promise();
        } catch (e) {
          await ddb.delete({ TableName: TABLE_NAME, Key: { connectionId } }).promise();
        }

      }))
    }
  })

  try {
    await Promise.all(postCalls);
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }
};
