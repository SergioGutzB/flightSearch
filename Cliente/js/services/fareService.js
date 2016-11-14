angular
  .module('FareService', [])
  .factory('fare', ['$http', '$filter', 'iata', function($http, $filter, $iata) {
    var filter = $filter('filter')
    var all_fares = []
    var more = true
    var page = 0
    var purchase_fares = null

    function search(origin, destination, departure_date, return_date, passengers, callback) {
      $http({
        url: '/search/',
        method: 'POST',

        data: {
          origin: origin,
          destination: destination,
          departure_date: departure_date,
          return_date: return_date,
          adults: passengers.adults,
          children: passengers.children,
          babies1: passengers.babies1
        }
      })

      .success(function(data) {
        // reset variables
        all_fares = []
        more = true
        page = 0

        callback()
      })

      .error(function(err) {
        callback(err)
      })
    }

    function next(result, callback) {
      if (!more) callback(null)
      $http({
          url: 'http://127.0.0.1:3000/api/result/pages/',
          method: 'POST',
          data: {
            page: page,
            result: result
          }
        })
        .success(function(data) {
          parse_prices(data.fares)
          parse_dates(data.fares)
          all_fares = all_fares.concat(data.fares)
          page += 1

          callback(all_fares, page - 1, data.fares)
        })
        .error(function() {
          // no more results because current page number doesnt exist
          more = false
          callback(null)
        })
    }


    function parse_prices(fares) {
      for (index in fares) {
        var fare = fares[index]
        var separate_index = fare.amount.match('[0-9]').index

        fare.currency = fare.amount.substr(0, separate_index)
        fare.price = Number(fare.amount.substr(separate_index))
      }
    }

    function parse_dates(fares) {
      fares.forEach(function(fare) {
        if (fare.departure) {
          fare.departure.departure_date = new Date(fare.departure.departure_date)
          fare.departure.arrival_date = new Date(fare.departure.arrival_date)
        } else if (fare.return) {
          fare.return.departure_date = new Date(fare.return.departure_date)
          fare.return.arrival_date = new Date(fare.return.arrival_date)
        }
      })
    }

    function getDetails(results, key, callback) {
      var fares = filter(all_fares, { key: key })
      if (fares.length > 0) {
        var fare = fares[0]
        if (fare.details) {
          callback(null, fare)
        } else {
          $http({
              url: 'http://127.0.0.1:3000/api/results/details/',
              method: 'POST',
              data: {
                key: key,
                result: results
              }
            })
            .success(function(data) {
              fare.details = data
              fare.details.trips.forEach(function(trip) {
                trip.segments.forEach(function(segment) {
                  $iata.get_city(segment.origin, function(city) {
                    var origin_city = city

                    $iata.get_city(segment.destination, function(city) {
                      var destination_city = city

                      segment.origin = { code: segment.origin, name: origin_city }
                      segment.destination = { code: segment.destination, name: destination_city }
                    })
                  })
                })
              })
              callback(null, fare)
            })
            .error(function(error) {
              callback(error)
            })
        }
      }
    }

    function getFaresforPurchase() {
      return purchase_fares
    }

    function setFaresforPurchase(fares) {
      purchase_fares = fares
      sessionStorage.service = 'Air'
      sessionStorage.fares = JSON.stringify(fares)
    }

    return {
      next: next,
      search: search,
      details: getDetails,
      setFaresforPurchase: setFaresforPurchase,
      getFaresforPurchase: getFaresforPurchase,
      searchFare: function(origin, destination, departure_date, return_date, passengers) {
        global = $http({
          method: 'GET',
          url: 'http://127.0.0.1:3000/api/search/?origin=' + origin + '&destination=' + destination + '&departure_date=' + departure_date + '&return_date=' + return_date + '&adults=' + passengers.adults + '&children=' + passengers.children + '&babies1=' + passengers.babies1
        })
        all_fares = []
        more = true
        page = 0
        return global
      },
      getTime: function(destination, departure_date) {
        global = $http({
          method: 'POST',
          url: 'http://127.0.0.1:3000/clima_actual/',
          data: {
            ciudad: destination,
            fecha: departure_date,
          }
        })
        return global
      },
      setReserva: function(reserva) {
        global = $http({
          method: 'POST',
          url: 'http://127.0.0.1:3000/api/reserva/',
          data: reserva
        })
        return global
      },
      getReservas: function() {
        global = $http({
          method: 'GET',
          url: 'http://127.0.0.1:3000/api/reserva/'
        })
        return global
      },
      updateReserva: function(reserva) {
        global = $http({
          method: 'PUT',
          url: 'http://127.0.0.1:3000/api/reserva/' + reserva._id,
          data: reserva
        })
        return global
      },
      removeReserva: function(reserva_id) {
        global = $http({
          method: 'DELETE',
          url: 'http://127.0.0.1:3000/api/reserva/' + reserva_id
        })
        return global
      },
      getReservaCustomer: function(customer_id) {
        global = $http({
          method: 'GET',
          url: 'http://127.0.0.1:3000/api/reserva/' + customer_id
        })
        return global
      },
      getReservaID: function(reserva_id) {
        global = $http({
          method: 'GET',
          url: 'http://127.0.0.1:3000/api/reserva/' + reserva_id
        })
        return global
      }
    }
  }])