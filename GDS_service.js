var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var http = require('http')
var app = express()

/*------------------Express config ------------------------*/
var allowCrossDomain = function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
}
app.use(allowCrossDomain)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/*------------------Routing Started ------------------------*/
app.get('/search/', function(req, res) {
  console.log("/search/")
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
})

app.post('/result/pages/', function(req, res) {
  console.log("consultando /result/pages/")
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
    console.log(body)
    res.send(body)
  })
})

app.post('/results/details/', function(req, res) {
  console.log("consultando /results/details/")
  console.log(req.body)
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
    console.log(body)
    res.send(body)
  })
})

/*--------------------Routing Over----------------------------*/
// SE ESCUCHA PARA SERVIR
var port = 3000;
app.listen(port, function() {
  console.log('GDS_Service listening on port ' + port)
})