'use strict';

import { DynamoDB } from 'aws-sdk'

const dynamoDB = new DynamoDB.DocumentClient();

module.exports.list = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': "TODO"
    }
  };

  try {
    const data = await dynamoDB.query(params).promise();
    const todos = data.Items;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Todos retrieved successfully',
        todos: todos
      })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error retrieving Todos',
        error: err
      })
    };
  }
};
