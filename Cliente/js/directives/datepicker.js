jQuery(function($) {
  $.datepicker.regional['es'] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ],
    dayNames: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Juv', 'Vie', 'Sab'],
    dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    weekHeader: 'Sm',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
  };
  $.datepicker.setDefaults($.datepicker.regional['es']);
});

angular
  .module('clienteAPP')
  .directive('datePicker', ['$timeout', '$filter', '$location', function($timeout, $filter, $location) {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/templates/datepicker.html',
      scope: {
        departure: "=",
        return: "=",
        showReturn: "=",
        dep: "=",
        arr: "="
      },

      controller: function($scope) {

        $scope.getDays = function() {

          var dat1 = $scope.departure;
          var dat2 = $scope.return;

          if (!dat2) {
            return "";
          }

          if (dat2.getTime() == dat1.getTime()) {
            return "1 dia";
          }

          var fin = dat2.getTime() - dat1.getTime();
          var dias = Math.floor(fin / (1000 * 60 * 60 * 24)) + 1

          if (dias < 0) {
            dias = ((dias * (-1)) - 365) * (-1);
          }

          if (dias == 1) {
            return "1 dia";
          } else {
            return dias + " dias";
          }
        }

        $scope.index_location = $location.$$path;
      },

      link: function(scope, element, attrs) {

        element = angular.element(element);

        var departure_date = element.find("#departure_date");
        var return_date = element.find("#return_date");

        // ----
        // ---- watchers to update date vars on model change
        // ----

        scope.$watch('departure', function(newVal, oldVal) {

          if (!newVal) {
            return
          }

          var dateText = $filter('date')(newVal, 'MM/dd/yyyy');
          return_date.datepicker("option", "minDate", dateText);

          $timeout(function() {
            departure_date.val(dateText);
          });
        });

        scope.$watch('return', function(newVal, oldVal) {

          if (!newVal) {
            return
          }

          var dateText = $filter('date')(newVal, 'MM/dd/yyyy');
          departure_date.datepicker("option", "maxDate", dateText);

          $timeout(function() {
            return_date.val(dateText);
          });
        });

        // ----
        // ----   Date picker configuration
        // ----

        departure_date.datepicker({

          minDate: "0D",
          numberOfMonths: 2,

          onClose: function(selectedDate) {
            //return_date.datepicker( "option", "minDate", selectedDate);
            var date1 = angular.element(this).datepicker("getDate");
            var date2 = return_date.datepicker("getDate")

            if (date2 && date1 >= date2) {
              scope.return = scope.departure;
              scope.$apply();
            };
            scope.dep();
          },

          onSelect: function(selectedDate, instance) {
            var date = angular.element(this).datepicker("getDate");

            scope.departure = date;
            scope.$apply();
          }
        });

        return_date.datepicker({
          minDate: "0D",
          maxDate: "360D",
          numberOfMonths: 2,

          onClose: function(selectedDate) {
            //departure_date.datepicker( "option", "maxDate", selectedDate);
            scope.arr();
          },

          onSelect: function(selectedDate, instance) {
            var date = angular.element(this).datepicker("getDate");

            scope.return = date;
            scope.$apply();
          }

        });
      }
    }
  }]);