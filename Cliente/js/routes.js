angular
  .module('clienteAPP')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

      .when('/', {
      templateUrl: '../templates/index.html',
      controller: 'Index'
    })

    // .when('/results/:origin-:destination/:departure/adults-:adults/children-:children/seat-babies-:babies1/babies-:babies2/', {
    //   templateUrl: '../templates/homeResults.html',
    //   controller: 'Results',
    //   resolve: {
    //     stretch: function() {
    //       return {
    //         getNumber: function() {
    //           return 1;
    //         }
    //       };
    //     }
    //   }
    // })

    .otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });


  }]);