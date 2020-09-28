const delay = require('webpack-api-mocker/utils/delay')
const user = require('./user')
const table = require('./table')
const article = require('./article')

const mocks = {
  ...user,
  ...table,
  ...article
}

module.exports = delay(mocks, 1000)
module.exports.mocks = mocks
