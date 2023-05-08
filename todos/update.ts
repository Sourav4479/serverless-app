'use strict';

import { DynamoDB } from 'aws-sdk'

const dynamoDB = new DynamoDB.DocumentClient();

module.exports.update = async (event) => {
  const { id, text, checked } = JSON.parse(event.body);
  const timestamp = new Date().getTime();
  if(!id || !text || !checked) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required parameters' }),
    };
  }
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      pk: 'TODO',
      sk: 'TODO#' + id,
    },
    UpdateExpression: 'set #text = :text, #checked = :checked, #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#text': 'text',
      '#checked': 'checked',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':text': text,
      ':checked': checked,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  };
  
  try {
    const result = await dynamoDB.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating TODO item' }),
    };
  }
};
