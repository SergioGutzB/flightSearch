var clienteAPP = angular.module('clienteAPP')

clienteAPP.controller('Index', ['$scope', '$http', '$location', 'fare', 'iata', '$filter', function($scope, $http, $location, $fare, $iata, $filter) {

  $iata.get_airports(function(airports) {
    $scope.airports = airports;
  });

  $scope.prueba = "Sergio"

  $scope.search = {
    adults: "1",
  }

  $scope.flight_option = 'roundTrip';

  $scope.search = function() {

    var origin = $scope.search.origin.originalObject.code;
    var destination = $scope.search.destination.originalObject.code;

    var adults = $scope.passengers.adults;
    var children = $scope.passengers.children;
    var babies1 = $scope.passengers.babies1;
    var babies2 = $scope.passengers.babies2;

    if ($scope.dates.departure) {
      var departure_date = $filter('date')($scope.dates.departure, 'yyyy-MM-dd');
    }

    if ($scope.dates.return) {
      var return_date = $filter('date')($scope.dates.return, 'yyyy-MM-dd');
    }

    if ($scope.flight_option == 'oneWay') {
      $location.path('/results/' + origin + '-' + destination + '/' +
        departure_date + '/adults-' + adults + '/children-' + children + '/seat-babies-' + babies1 + '/babies-' + babies2 + '/');
    } else {
      $location.path('/results/' + origin + '-' + destination + '/' +
        departure_date + '/' + return_date + '/adults-' + adults + '/children-' + children + '/seat-babies-' + babies1 + '/babies-' + babies2 + '/');

    }
  }

  $scope.select_origin = function(origin) {
    $scope.search.origin = origin;
    next_item = ('#destination_value');
    if (origin != null) {
      f = angular.element(next_item).click().focus();
    } else {
      pv_item = ('#origin_value');
      g = angular.element(pv_item).click().focus();
    }
  }

  $scope.select_destination = function(destination) {
    $scope.search.destination = destination;
    nt_item = ("#departure_date");
    if (destination != null) {
      f = angular.element(nt_item).click().focus();
    } else {
      p_item = ('#destination_value');
      g = angular.element(p_item).click().focus();
    }
  }

  $scope.dep = function() {
    var departure = $scope.dates.departure;
    round = $scope.flight_option;
    if (departure != null && round != "oneWay") {
      arrival = ('#return_date');
      a = angular.element(arrival).focus().click();
    }
  }

  $scope.arr = function() {
    var arrival = $scope.dates.return;
    var departure = $scope.dates.departure;
    var round = $scope.flight_option;
    if (round == 'roundTrip' && departure == null && arrival == null) {
      arrival = ('#return_date');
      a = angular.element(arrival).focus().click();
    }
  }

  $scope.change_flight_option = function(option) {

    $scope.flight_option = option;
    $scope.dates.showReturn = (option == 'roundTrip');

  }

  $scope.passengers = {
    adults: 1,
    children: 0,
    babies1: 0,
    babies2: 0
  }

  $scope.dates = {
    departure: null,
    return: null
  }

}]);