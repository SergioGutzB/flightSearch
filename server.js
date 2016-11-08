var express = require('express'),
    app = express();

function pronostico(fecha){
  return Math.floor(Math.random()*(100 - 0)) ;
}

var clima = function(lugar, fecha){
  var base = { 
    'bogota': {
      'temperatura': pronostico(fecha),
      'humedad': pronostico(fecha),
    },
    'medellin': {
      'temperatura': pronostico(fecha),
      'humedad': pronostico(fecha),
    },
    'ciudad de mexico': {
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
app.get('/', function (req, res) {
  res.send('Hola accede a /clima para saber el clima de un lugar')
})

//PETICION PARA VER EL CLIMA ACTUAL DE UN SITIO
app.get('/clima_actual', function(req, res){
  res.send('Debes enviar una peticion POST con el parametro ciudad con el nombre de la ciudad')
});

app.post('/clima_actual', function(req, res){
  var data = clima(req['query']['ciudad'], req['query']['fecha']);
  res.end(JSON.stringify(data));
});

//SE ESCUCHA PARA SERVIR
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

