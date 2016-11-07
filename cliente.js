var soap = require('soap')
var url = 'http://127.0.0.1:8000/wsdl?wsdl'
var args = {
  destination_city: 'BOG',
  origin_city: 'MIA',
  departure_date: 'Wed Jan 18 2017 09:50:00 GMT-0500 (COT)',
  return_date: 'Wed Jan 18 2017 11:35:00 GMT-0500 (COT)',
  passengers: {
    adults: 1,
    children: 0,
    babies1: 0
  }
}

soap.createClient(url, function(err, client) {
  if (err) throw err
  console.log(client.describe().FlightService.fares)
  client.Search(args, function(err, result) {
    if (err) throw err
    console.log(result)
  })
})