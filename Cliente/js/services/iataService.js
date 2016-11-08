angular
  .module('clienteAPP')
  .factory('iata', ['$http', function($http) {

    var airports;
    var airports_all;

    function get_city(code, callback) {
      var city;


      get_object(code, function(object) {
        if (object) {
          city = object.airport.split(',', 1)[0];
        }

        callback(city);

      });
    }

    function get_object(code, callback) {
      var object;

      get_airports(function() {

        for (var i = 0; i < airports.length; i++) {
          if (airports[i].code == code) {
            object = airports[i]
          }
        }

        callback(object);

      });
    }

    function get_airports(callback) {

      if (airports) {
        return callback(airports);
      };

      $http
        .get('/json/iata.min.json')
        .success(function(data) {
          airports = data.airport_codes;
          callback(airports);
        })
        .error(function() {
          console.log('imposible get IATA json');
        });
    }


    return {
      get_airports: get_airports,
      get_object: get_object,
      get_city: get_city,
    }

  }]);