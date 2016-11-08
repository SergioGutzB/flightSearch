angular
  .module('FareService', [])
  .factory('fare', ['$http', '$filter', 'iata', function($http, $filter, $iata) {

    var filter = $filter('filter');
    var all_fares = [];
    var more = true;
    var page = 0;
    var purchase_fares = null;

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
        //reset variables
        all_fares = [];
        more = true;
        page = 0;

        callback();

      })

      .error(function(err) {
        callback(err);
      });
    }

    return {
      search: search
    }

  }]);