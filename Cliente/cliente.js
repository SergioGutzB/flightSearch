var soap = require('soap')
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

app.get('/', function(req, res) {
    res.sendFile('base.html', { root: __dirname + "/" });
  })
  // app.all('/*', function(req, res, next) {
  //   res.sendFile('base.html', { root: __dirname + "/" });
  // });

app.post('/search', function(req, res) {
  console.log("post search")
  var args = req.body.args
  var result = null;
  soap.createClient(url, function(err, client) {
    if (err) throw err
    console.log(client.describe().FlightService.fares)
    client.Search(args, function(err, response) {
      if (err) throw err
      res.send({ success: true, result: response })
      return
    })
  })
  console.log("Petición SOAP realizada!")
})


/*--------------------Routing Over----------------------------*/
app.listen(3001, function() {
  console.log('Express Started on Port 3001')
})