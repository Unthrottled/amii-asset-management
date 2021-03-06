const {
  schema: {
    definitionAttribute,
    partitionKey,
  }
} = require('./Config')

const extractItems = data => data.Items.map(item => ({
  'id': item[partitionKey],
  ...JSON.parse(item[definitionAttribute]),
}))

const extractItem = data => JSON.parse(data.Item[definitionAttribute])

const handleClientResponse = (res, transformer) => (err, data) => {
  if (err) {
    res.statusCode = 500;
    res.json({error: `Could not load items: ${err}`});
  } else if (transformer) {
    res.json(transformer(data));
  } else {
    res.statusCode = 200;
    res.send();
  }
}

module.exports = {
  handleClientResponse,
  extractItems,
  extractItem
}
