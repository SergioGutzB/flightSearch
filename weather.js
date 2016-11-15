var http = require('http');
var soap = require('soap');
var express = require('express');

var weatherService = {
  WeatherService: {
    weatherPort: {
      Search: function(args) {
        console.log("pille esto");
        var petition = 'api.openweathermap.org/data/2.5/weather?q='+args.city+',uk&APPID=774e78a49e9e0b1f7eed558ec2e259f6';
        express.get(petition, function(data){
          return data.main;
        });
        return {
          temperature: "15",
          humidity: "5"
        };
      }
    }
  }
};

var xml = require('fs').readFileSync("weather.wsdl", 'utf8');

var server = http.createServer(function(request, response) {
  //response.end("404: Not Found: " + request.url);
  response.end("Hola mundo");
});

server.listen(3001);
soap.listen(server, '/wsdl', weatherService, xml);

console.log("Http SOA Server started on port 3001");
