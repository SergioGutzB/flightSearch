angular
  .module('clienteAPP')
  .directive('mybackgroundimage', function($http, $templateCache) {
    return function(scope, element, attrs) {
      scope.loadData = function() {

        $http({ method: 'GET', url: '/backgroundImages/', cache: true }).then(function(result) {

          var n_random = Math.floor((Math.random() * (result.data.length - 1)) + 1);

          angular.element(document.getElementById("content_index")).css({
            'background-image': 'url(' + "/" + result.data[n_random].fields.backgroundImage + ')',
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'background-position': 'center center'
          });

        });
      }
    };
  });