const delay = require('webpack-api-mocker/utils/delay')
const user = require('./user')

const mocks = {
  ...user,
  'GET /mock/upload/getToken': {
    status: 200,
    data: {
      domain: 'http://xxx.com',
      token: 'xxxxxxxxxxx'
    }
  },
}

module.exports = delay(mocks, 1000)
module.exports.mocks = mocks
