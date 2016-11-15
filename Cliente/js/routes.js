angular
  .module('clienteAPP')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

      .when('/', {
      templateUrl: '/templates/index.html',
      controller: 'Index'
    })

    .when('/results/:origin-:destination/:departure/adults-:adults/children-:children/seat-babies-:babies1/babies-:babies2/', {
      templateUrl: '/templates/homeResults.html',
      controller: 'Results',
      resolve: {
        stretch: function() {
          return {
            getNumber: function() {
              return 1;
            }
          };
        }
      }
    })

    .when('/results/:origin-:destination/:departure/:return/adults-:adults/children-:children/seat-babies-:babies1/babies-:babies2/', {
      templateUrl: '/templates/homeResults.html',
      controller: 'Results',
      resolve: {
        stretch: function() {
          return {
            getNumber: function() {
              return 2;
            }
          };
        }
      }
    })

    .when('/compra/', {
      templateUrl: '/templates/buy.html',
      controller: 'Purchase'
    })

    .when('/reservas/', {
      templateUrl: '/templates/reservas.html',
      controller: 'Reserva'
    })

    .when('/update/', {
      templateUrl: '/templates/edit_info_buy.html',
      controller: 'Purchase'
    })


    .otherwise({
      redirectTo: '/'
    });

    // $locationProvider.html5Mode(true);

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false,
      rewriteLinks: false
    });


  }]);