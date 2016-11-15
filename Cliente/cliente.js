var express = require('express')
var bodyParser = require('body-parser')
var app = express()

var allowCrossDomain = function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
}
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(allowCrossDomain)
app.use(express.static(__dirname + '/'))
app.use('/images', express.static(__dirname + '/images'));
app.use('/templates', express.static(__dirname + '/templates'));
app.use('/css', express.static(__dirname + '/css'));

/*--------------------SOAP CLIENT----------------------------*/

var url = 'http://127.0.0.1:8000/wsdl?wsdl'

/*------------------Routing Started ------------------------*/

// app.get('/', function(req, res) {
//   res.sendFile('base.html', { root: __dirname + "/" });
// })
app.all('/*', function(req, res, next) {
  res.sendFile('base.html', { root: __dirname + "/" });
});

/*--------------------Routing Over----------------------------*/
app.listen(3001, function() {
  console.log('Express Started on Port 3001')
})