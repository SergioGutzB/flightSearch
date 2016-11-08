var fs = require('fs')

var flightService = {
  FlightService: {
    fares: {
      Search: function(args) {
        var obj
        var result = null
        var contents = fs.readFileSync('fares.json', 'utf8')
        obj = JSON.parse(contents)
        if (args.destination_city != null && args.origin_city != null)
          result = obj.fares.filter(function(fare) {
            return fare.destination_city === args.destination_city
          })
        console.log(result)
        result = result.filter(function(fare) {
            return fare.origin_city === args.origin_city
          })
          // result = result.filter(function(fare) {
          //   return fare.departure.departure_date === args.departure_date
          // })
        console.log(result)
        return result
      }
    }
  }
}

var xml = require('fs').readFileSync('flight.wsdl', 'utf8')

var soap = require('soap')
  // http server example 
var http = require('http')
var server = http.createServer(function(request, response) {
  response.end('404: Not Found: ' + request.url)
})

server.listen(8000)
soap.listen(server, '/wsdl', flightService, xml)
console.log('Http SOA Server Started on Port 8000')