var express = require('express'),
    app = express();

var clima = { 
  'bogota': {
    'temperatura': 25,
    'humedad': 12
  },
  'medellin': {
    'temperatura': 10,
    'humedad': 5
  },
  'ciudad de mexico': {
    'temperatura': 30,
    'humedad': 25
  },
  'barranquilla': {
    'temperatura': 25,
    'humedad': 13
  },
}

app.get('/', function (req, res) {
  res.send('Hola accede a /clima para saber el clima de un lugar')
})

app.get('/clima', function(req, res){
  res.send('Debes enviar una peticion POST con el parametro ciudad con el nombre de la ciudad')
});

app.post('/clima', function(req, res){
  var data = clima[req['query']['ciudad']];
  res.end(JSON.stringify(data));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

