'use strict'

import * as uuid from 'uuid'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body);
  console.log("Request:", data)

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      pk: 'TODO',
      sk: 'TODO#' + uuid.v1(),
      text: data.title,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }

  // write the todo to the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(new Error('Couldn\'t create the todo item.'))
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    }
    callback(null, response)
  })
}
