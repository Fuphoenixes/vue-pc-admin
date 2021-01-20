const Mock = require('mockjs')

const getData = pageSize => Mock.mock({
  [`items|${pageSize}`]: [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

module.exports = {
  'GET /mock/table/list': (req, res) => {
    const { pageSize, pageIndex } = req.query
    const items = getData(pageSize).items
    if (pageIndex > 3) {
      res.send({
        status: 200,
        data: {
          total: 30,
          items: []
        }
      })
      return
    }
    res.send({
      status: 200,
      data: {
        total: 30,
        items: items
      }
    })
  }
}
