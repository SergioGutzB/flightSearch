var soap = require('soap');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//var url = 'http://127.0.0.1:8080/wsdl?wsdl';
var url = 'http://127.0.0.1:3001/wsdl';

app.post('/weather', function(req, res){
  console.log("-------------------");
  console.log(req.query);
  console.log("-------------------");
  var args = req.query;
  var result = null;
  soap.createClient(url, function(err, client) {
      client.Search(args, function(err, result) {
          console.log(result);
          res.send({ success: true, result: response });
          return;
      });
  });
  console.log("se fue la peticion");
});
app.listen(8080, function() {
    console.log('Express Started on Port 8080');
});
