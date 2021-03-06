const express = require('express');
const {
  tableName,
  dynamodb,
  sortKeyIndex,
  assetTypes: {
    visuals
  },
  schema: {
    definitionAttribute,
    timeStampAttribute,
    sortKey,
    partitionKey,
  }
} = require('./Config');
const omit = require('lodash/omit')
const {
  handleClientResponse,
  extractItem,
  extractItems,
} = require('./Tools')

const adminAPI = express.Router();

adminAPI.get('/visuals/:id', (
  req, res) => {
  const {id} = req.params
  dynamodb.get({
    TableName: tableName,
    Key: {
      [partitionKey]: id,
      [sortKey]: visuals
    }
  }, handleClientResponse(res, extractItem));
});

adminAPI.get(
  `/:asset_type`,
  (req, res) => {
    const {asset_type} = req.params
    const queryParams = {
      TableName: tableName,
      IndexName: sortKeyIndex,
      ExpressionAttributeValues: {
        ':t': asset_type,
      },
      KeyConditionExpression: `${sortKey} = :t`
    };
    dynamodb.query(queryParams, handleClientResponse(
      res,
      extractItems
    ));
  })

adminAPI.post(
  `/:asset_type`,
  (req, res) => {
    const {asset_type} = req.params
    const newAssets = req.body

    const uploadTime = Math.round(new Date().valueOf() / 1000);
    const batchWrite = {
      RequestItems: {
        [tableName]: newAssets.map(asset => ({
          PutRequest: {
            Item: {
              [partitionKey]: asset.id,
              [sortKey]: asset_type,
              [definitionAttribute]: JSON.stringify(omit(asset, ['id'])),
              [timeStampAttribute]: uploadTime,
            }
          }
        }))
      }
    };

    dynamodb.batchWrite(batchWrite, handleClientResponse(res));
  });

module.exports = adminAPI
