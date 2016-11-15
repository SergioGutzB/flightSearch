var express = require('express')
var bodyParser = require('body-parser')
var http = require('http')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
require('./models')
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
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

/*------------------Routing Started ------------------------*/

require('./routes.js')(app);

/*--------------------Routing Over----------------------------*/
// SE ESCUCHA PARA SERVIR
var port = 3000
app.listen(port, function() {
  console.log('GDS_Service listening on port ' + port)
})