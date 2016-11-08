angular
.module('BarsService', [])
.factory('bars', ['$http', function($http){

  var fares_bars;

  function get_fares(callback) {
    
    if (fares_bars) {
      return callback(fares_bars);
    };

    $http
      .get('/static/volairesApp/json/test-bars.json')
      .success(function(data) {
        fares_bars = data.fares;
        callback(fares_bars);
      })
      .error(function(){
      });
  }


  return {
    get_fares: get_fares
  }

}]);