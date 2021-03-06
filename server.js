var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var allowCrossDomain = function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
}

app.use(allowCrossDomain)
app.use(bodyParser.json())

function pronostico(fecha) {
  return Math.floor(Math.random() * (100 - 0));
}

var clima = function(lugar, fecha) {
  var base = {
    'BOG': {
      'temperatura': pronostico(fecha),
      'humedad': pronostico(fecha),
    },
    'MIA': {
      'temperatura': pronostico(fecha),
      'humedad': pronostico(fecha),
    },
    'CLO': {
      'temperatura': pronostico(fecha),
      'humedad': pronostico(fecha),
    },
    'barranquilla': {
      'temperatura': pronostico(fecha),
      'humedad': pronostico(fecha),
    },
  };
  return base[lugar];

};
//RAIZ DE VISITA DEL SITIO
app.get('/', function(req, res) {
  res.send('Hola accede a /clima para saber el clima de un lugar')
})

//PETICION PARA VER EL CLIMA ACTUAL DE UN SITIO
app.get('/clima_actual', function(req, res) {
  res.send('Debes enviar una peticion POST con el parametro ciudad con el nombre de la ciudad')
});

app.post('/clima_actual', function(req, res) {
  console.log(req.body)
  var data = clima(req.body.ciudad, req.body.fecha);
  res.send(JSON.stringify(data));
});

//SE ESCUCHA PARA SERVIR
app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})