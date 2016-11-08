angular
  .module('clienteAPP')
  .directive('passengersPicker', [function() {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '../../templates/passengers_picker.html',
      scope: {
        passengers: "=",
        max: "@",
        maxPer: "@",
        minAdults: "@"
      },

      controller: function($scope, $element) {
        $scope.passengers.total = function() {
          var total = 0;

          for (key in this) {
            if (typeof(this[key]) === 'number') {
              total += this[key];
            }
          }

          return total;
        }

        $scope.operate = function(e, elem, value) {
          // Stop acting like a button
          e.preventDefault();

          // Get the field name
          var fieldName = $(elem).attr('field');

          //set default value if it's null
          $scope.passengers[fieldName] = $scope.passengers[fieldName] || 0;

          //current value
          var currentVal = $scope.passengers[fieldName]

          if ((value < 0 && currentVal > 0) || (value > 0 && $scope.passengers.total() < $scope.max && currentVal < $scope.maxPer)) {
            $scope.passengers[fieldName] += value;

            if (fieldName == "adults" && $scope.passengers.adults < $scope.minAdults) {
              $scope.passengers.adults = parseInt($scope.minAdults);
            }

            if (fieldName == "babies1" && $scope.passengers.babies1 > $scope.passengers.adults) {
              alert("Muchos infantes")
              $scope.passengers.babies1 = $scope.passengers.adults;
            } else if (fieldName == "adults" && $scope.passengers.adults < $scope.passengers.babies1) {
              alert("El número de bebés no puede superar el número de adultos")
              $scope.passengers.babies1 = $scope.passengers.adults;
            }

            $scope.$apply();
          }
        }
      },

      link: function(scope, element, attrs) {

        angular.element(element).find('.dropdown-menu').click(function(e) {
          e.stopPropagation();
        })

        angular.element('.adultsp,.childrenp,.babies1p,.babies2p').click(function(e) {
          scope.operate(e, this, 1);
        });

        angular.element('.adultsm,.childrenm,.babies1m,.babies2m').click(function(e) {
          scope.operate(e, this, -1);
        });

      }
    }

  }]);