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
    const responseData =  todos.map((value)=> {
      return {
        userId : 1,
        id: value.id,
        title: value.text,
        completed: value.checked
      }
    });
    return {
      statusCode: 200,
      body: JSON.stringify(responseData)
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
