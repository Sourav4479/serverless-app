'use strict';

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()
const dynamodb = new DynamoDB();

module.exports.get = async (event) => {
  const todoId = event.pathParameters.id;
console.log(todoId);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      'pk': { S: 'TODO' },
      'sk': { S: 'TODO#' + todoId }
    }
  };

  try {
    const result = await dynamodb.getItem(params).promise();
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Todo item not found' })
      };
    }

    const todo = {
      id: result.Item.id.S,
      pk: result.Item.pk.S,
      sk: result.Item.sk.S,
      text: result.Item.text.S,
      checked: result.Item.checked.BOOL,
      createdAt: result.Item.createdAt.N,
      updatedAt: result.Item.updatedAt.N
    };

    return {
      statusCode: 200,
      body: JSON.stringify(todo)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving todo item' })
    };
  }
};
