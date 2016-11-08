var clienteAPP = angular.module('clienteAPP')

clienteAPP.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])

clienteAPP.controller('NavbarController', ['$scope', '$location', '$filter',
  function($scope, $location, $filter) {
    $scope.getClass = function(path) {
      if ($location.path().substr(0, path.length) === path) {
        return 'active';
      } else {
        return '';
      }
    }

  }
]);