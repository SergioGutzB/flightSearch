var request = require('request')

exports.getSearch = function(req, res) {
  console.log('/search/')
  var options = {
    method: 'POST',
    url: 'http://127.0.0.1:8000/search/',
    headers: {
      'cache-control': 'no-cache'
    },
    json: true,
    body: {
      origin: req.query.origin,
      destination: req.query.destination,
      departure_date: req.query.departure_date,
      return_date: req.query.return_date,
      adults: req.query.adults,
      children: req.query.children,
      babies1: req.query.babies1
    }
  }
  request(options, function(error, response, body) {
    if (error) throw new Error(error)
    res.send({ success: true, result: body })
  })
}

exports.setPages = function(req, res) {
  console.log('consultando /result/pages/')
  var options = {
    method: 'GET',
    url: 'http://127.0.0.1:8000/results/page/' + req.body.page + '/',
    json: true,
    body: {
      'solution': req.body.result.solution,
      'solution_return': req.body.result.solution_return
    }
  }
  request(options, function(error, response, body) {
    if (error) throw new Error(error)
    res.send(body)
  })
}

exports.setDetails = function(req, res) {
  console.log('consultando /results/details/')
  var options = {
    method: 'GET',
    url: 'http://127.0.0.1:8000/results/details/' + req.body.key + '/',
    json: true,
    body: {
      'solution': req.body.result.solution,
      'solution_return': req.body.result.solution_return
    }
  }
  request(options, function(error, response, body) {
    if (error) throw new Error(error)
    res.send(body)
  })
}