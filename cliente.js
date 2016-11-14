var soap = require('soap');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var url = 'http://127.0.0.1:3001/wsdl?wsdl';
// var url = 'http://127.0.0.1:3001/wsdl';

app.post('/weather', function(req, res) {
  console.log("-------------------");
  console.log(req.query);
  console.log("-------------------");
  var args = req.body;
  var result = null;
  soap.createClient(url, function(err, client) {
    if (err) throw err
    client.Search(args, function(err, result) {
      if (err) throw err
      console.log(result);
      res.send({ success: true, result: result });
    });
  });
  console.log("se fue la peticion");
});
app.listen(8080, function() {
  console.log('Express Started on Port 8080');
});