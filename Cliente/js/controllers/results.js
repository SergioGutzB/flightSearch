var clienteAPP = angular.module('clienteAPP')

clienteAPP.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

clienteAPP.run(function($rootScope, $location) {
  $rootScope.$on('duScrollspy:becameActive', function($event, $element) {
    var id = $element[0].href.split('#')[1]

    angular.element(document.getElementById(id)).addClass('range_group')
    angular.element(document.getElementById('footer')).addClass('hid')
  })

  $rootScope.$on('duScrollspy:becameInactive', function($event, $element) {
    var id = $element[0].href.split('#')[1]

    angular.element(document.getElementById(id)).removeClass('range_group')
  })
})

var result_sol = {};

clienteAPP.controller('Results', ['$http', '$filter', 'fare', 'iata', '$routeParams', '$scope', '$modal', '$timeout', 'stretch', 'bars', '$location', '$window', function($http, $filter, $fare, $iata, $rp, $scope, $modal, $timeout, $stretch, $bars, $location, $window) {
  $scope.flight_option = $rp.return ? 'roundTrip' : 'oneWay'

  $scope.loading = true
  $scope.returnTrip = false
  $scope.calendarData = {
    departure: [],
    wayBack: [],
    depActive: -1,
    backActive: -1,
    maxDep: 0,
    maxRet: 0
  }

  $scope.currentPageD, $scope.currentPageR = 0
  $scope.pageSize = 20
  $scope.max = 0

  var w = angular.element($window)
  $scope.width = (w.width() - (w.width() * 30 / 100)) / 2
  $scope.height = 100

  var solution = {};
  var solution_return = {};


  $fare.searchFare($rp.origin, $rp.destination, $rp.departure, $rp.return, { adults: $rp.adults, children: $rp.children, babies1: $rp.babies1, babies2: $rp.babies2 })
    .then(function(res) {
      // console.log(res.data.result);
      result_sol = res.data.result;
      solution = res.data.result.solution;
      solution_return = res.data.result.solution_return;
      $scope.loading = false;
      next();
    }, function(err) {
      $scope.alerts = [
        { type: 'info', msg: 'Lo sentimos! en este momento no existen vuelos disponibles, por favor intenta en unos minutos.' }
      ];
      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };
    });

  // $fare.getTime($rp.destination, $filter('date')($rp.departure, 'yyyy-MM-dd'))
  //   .then(function(res) {
  //     $scope.temperatura = res.data.temperatura;
  //     $scope.humedad = res.data.humedad;
  //   });


  var filter = $filter('filter')
  var orderBy = $filter('orderBy')

  var container = angular.element(document.getElementById('scroll_results'))

  var departure_date, return_date
  var selected_fares = []

  $scope.origin = ''
  $scope.destination = ''

  // ---
  // --- load search parameters on form fields
  // ---

  $scope.search = {}

  // - DEPRECATED when multi will be implemented
  $iata.get_object($rp.origin, function(obj) {
    $scope.search.origin = {
      originalObject: obj
    }

    $scope.origin = $scope.search.origin.originalObject.airport.split(',', 1)[0]
  })

  $iata.get_object($rp.destination, function(obj) {
    $scope.search.destination = {
      originalObject: obj
    }

    $scope.destination = $scope.search.destination.originalObject.airport.split(',', 1)[0]
  })

  var date = $rp.departure.split('-')

  $scope.dates = {}

  $scope.dates.departure = new Date(date[0], date[1] - 1, date[2])

  if ($rp.return) {
    var date = $rp.return.split('-')
    $scope.dates.return = new Date(date[0], date[1] - 1, date[2])
    $scope.dates.showReturn = true
  }

  // - END DEPRECATED

  $scope.passengers = {
    adults: parseInt($rp.adults),
    children: parseInt($rp.children),
    babies1: parseInt($rp.babies1),
    babies2: parseInt($rp.babies2)
  }

  // --- load airports from iata service

  $iata.get_airports(function(airports) {
    $scope.airports = airports
  })

  $scope.$watch('currentStretch.schedule.departure.min', function(newVal) {
    $scope.filter_fares()
  })

  $scope.$watch('currentStretch.schedule.departure.max', function(newVal) {
    $scope.filter_fares()
  })

  $scope.$watch('price.range.min', function(newVal) {
    $scope.filter_fares()
  })

  $scope.$watch('price.range.max', function(newVal) {
    $scope.filter_fares()
  })

  $scope.change_flight_option = function(option) {
    flight_option = option
    $scope.dates.showReturn = (option == 'roundTrip')

    $timeout(function() {
      $scope.$apply()
    })
  }

  function get_airlines(fares, stretch) {
    fares.forEach(function(fare) {
      // search by departure
      if (fare.departure && filter(stretch.airlines, { name: fare.departure.airline.name }).length == 0) {
        stretch.airlines.push({ name: fare.departure.airline.name })
      }

      // search by return
      else if (fare.return && filter(stretch.airlines, { name: fare.return.airline.name }).length == 0) {
        stretch.airlines.push({ name: fare.return.airline.name })
      }
    })
  }

  function get_scales(fares, stretch) {
    fares.forEach(function(fare) {
      if (fare.departure && filter(stretch.scales, { value: fare.departure.scales }).length == 0) {
        stretch.scales.push({ value: fare.departure.scales })
      } else if (fare.return && filter(stretch.scales, { value: fare.return.scales }).length == 0) {
        stretch.scales.push({ value: fare.return.scales })
      }
    })
  }

  function next() {
    $fare.next(result_sol, function(_fares, page, new_fares) {
      if (!_fares) return

      new_fares.forEach(function(fare) {
        if (fare.return) {
          fare.departure = fare.return
        }

        $iata.get_city(fare.departure.origin, function(city) {
          fare.origin_city = fare.departure.origin
        })

        $iata.get_city(fare.departure.destination, function(city) {
          fare.destination_city = fare.departure.destination
        })
      })

      new_fares = orderBy(new_fares, 'price')

      // clean price range
      if ($scope.currentStretch) {
        $scope.currentStretch.price_range.min = $scope.currentStretch.price_range.max = 0
      }

      if (page == 0) {
        $scope.stretchs = []

        for (var i = 0; i < $stretch.getNumber(); i++) {
          var stretch = {}

          stretch.fares = filter(new_fares, { round_trip: i })

          stretch.price_range = {
            min: 0,
            max: 0
          }

          stretch.schedule = {
            'departure': {
              min: 0,
              max: 24
            }
          }

          stretch.price = {
            range: {
              min: 50,
              max: 94000000
            }
          }

          if (stretch.fares[0].departure) {
            stretch.departure_date = angular.copy(stretch.fares[0].departure.departure_date)
          } else if (stretch.fares[0].return) {
            stretch.departure_date = angular.copy(stretch.fares[0].return.departure_date)
          }

          stretch.departure_date.setHours(0)
          stretch.departure_date.setMinutes(0)

          stretch.airlines = []
          stretch.scales = []

          get_airlines(stretch.fares, stretch)
          get_scales(stretch.fares, stretch)

          $scope.stretchs.push(stretch)
        }

        $scope.go_to_stretch(0)
      } else {
        for (var i = 0; i < $scope.stretchs.length; i++) {
          var stretch = $scope.stretchs[i]
          var stretch_new_fares = filter(new_fares, { round_trip: i })

          get_airlines(stretch_new_fares, stretch)
          get_scales(stretch_new_fares, stretch)

          stretch.fares = stretch.fares.concat(stretch_new_fares)
        }
      }

      $scope.filter_fares()
    })
  }

  function get_price_ranges(fares) {
    $scope.currentStretch.prices = []

    var delta = Math.round(fares.length / 10) + 1

    for (var i = 0; i < fares.length; i += delta) {
      var same = filter($scope.currentStretch.prices, { price: fares[i].price }).length

      if (same == 0) {
        $scope.currentStretch.prices.push({ price: fares[i].price })
      }
    }
  }

  function airlines_filter(fare) {
    var current = $scope.currentStretch

    return !current.airline || (current.airline.name == fare.departure.airline.name ||
      (fare.return && current.airline.name == fare.return.airline.name))
  }

  function scale_filter(fare) {
    var current = $scope.currentStretch

    return !current.scale || (current.scale.value == fare.departure.scales ||
      (fare.return && current.scale.value == fare.return.scales))
  }

  function price_filter(fare) {
    var current = $scope.currentStretch

    return fare.price >= current.price.range.min && fare.price <= current.price.range.max
  }

  function schedule_filter(fare) {
    var current = $scope.currentStretch
    var cont = 0
    if (fare.departure) {
      var min_departure = new Date(current.departure_date)
      var max_departure = new Date(current.departure_date)

      min_departure.setHours(current.schedule.departure.min)
      max_departure.setHours(current.schedule.departure.max)

      return fare.departure.departure_date >= min_departure && fare.departure.departure_date <= max_departure
    } else if (fare.return) {
      var min_return = new Date(current.departure_date)
      var max_return = new Date(current.departure_date)

      min_return.setHours(current.schedule.departure.min)
      max_return.setHours(current.schedule.departure.max)

      return fare.return.departure_date >= min_return && fare.return.departure_date <= max_return
    }
  }

  function drawCalendar(index) {
    $scope.calendarData.departure = departure_calendar_data($scope.calendar, index)
    $scope.calendarData.wayBack = return_calendar_data($scope.calendar[$scope.calendarData.depActive].fares)
    loadCalendar()
  }

  function loadCalendar() {
    var aux = $scope.calendarData.departure
    $scope.calendarData.maxDep = orderBy(aux, 'value').slice(-1)[0].value
    var aux2 = $scope.calendarData.wayBack
    $scope.calendarData.maxRet = orderBy(aux2, 'value').slice(-1)[0].value
  }

  $scope.months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  $scope.days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

  function departure_calendar_data(solutions, index) {
    dateFilter = function(fare) {
      return fare.departure_date.getDate() == $scope.active_bar_date.getDate()
    }

    result = []
    for (i in solutions) {
      option = {}
      solutions[i].departure_date = new Date(solutions[i].departure_date)
      option['month'] = $scope.months[solutions[i].departure_date.getMonth()]
      option['day'] = solutions[i].departure_date.getDate()
      option['weekday'] = $scope.days[solutions[i].departure_date.getDay()]
      option['value'] = orderBy(solutions[i].fares, 'amount')[0].amount
      option['price'] = (option['value'] * 1000).toString()
      result.push(option)
    }
    if (!index && index != 0) {
      $scope.active_bar_date = new Date($rp.departure + 'T12:00:00')
    }
    $scope.calendarData.depActive = $scope.calendar.indexOf(filter($scope.calendar, dateFilter)[0])
    return result
  }

  function return_calendar_data(solutions) {
    result = []
    for (i in solutions) {
      option = {}
      solutions[i].departure_date = new Date(solutions[i].departure_date)
      solutions[i].return_date = new Date(solutions[i].return_date)
      option['month'] = $scope.months[solutions[i].return_date.getMonth()]
      option['day'] = solutions[i].return_date.getDate()
      option['weekday'] = $scope.days[solutions[i].return_date.getDay()]
      option['value'] = solutions[i].amount
      option['price'] = (option['value'] * 1000).toString()
      result.push(option)
    }
    $scope.calendarData.backActive = result.indexOf(orderBy(result, 'value')[0])
    return result
  }

  function check_date_diference(departure) {
    today = new Date()
    dep = new Date(departure)
    milliseconds = 0
    daysDiff = Math.ceil(Math.abs(dep.getTime() - today.getTime()) / (1000 * 3600 * 24))
    if (daysDiff >= 15) {
      milliseconds = 15 * 24 * 60 * 60 * 1000
    } else {
      milliseconds = (daysDiff - 1) * 24 * 60 * 60 * 1000
    }
    time = dep.getTime()
    dep.setTime(time - milliseconds)
    return dep
  }

  $scope.barClicked = function(index, option) {
    if (index != -1) {
      $scope.active_bar_date = $scope.calendar[index].departure_date
      current_date_departure = $scope.calendar[index].departure_date.toISOString().substring(0, 10)
    } else {
      if (option == 1) {
        $scope.active_bar_date = $scope.calendar.slice(-1)[0].departure_date
        current_date_departure = $scope.calendar.slice(-1)[0].departure_date.toISOString().substring(0, 10)
      } else {
        $scope.active_bar_date = check_date_diference($scope.calendar[0].departure_date)
        current_date_departure = new Date($scope.active_bar_date).toISOString().substring(0, 10)
      }
    }
    get_calendar(index, current_date_departure)
  }

  $scope.barReturnClicked = function(index) {
    $scope.calendarData.backActive = index
  }

  $scope.changeSearch = function() {
    current_departure = $scope.calendar[$scope.calendarData.depActive].departure_date.toISOString().substring(0, 10)
    current_return = $scope.calendar[$scope.calendarData.depActive].fares[$scope.calendarData.backActive].return_date.toISOString().substring(0, 10)
    $location.path('/results/' + $rp.origin + '-' + $rp.destination + '/' +
      current_departure + '/' + current_return + '/adults-' + $rp.adults + '/children-' + $rp.children + '/seat-babies-' + $rp.babies1 + '/babies-' + $rp.babies2 + '/')
  }

  $scope.filter_fares = function() {
    var current = $scope.currentStretch

    if (!current || !current.fares) return

    current.visibleFares = filter(current.fares, airlines_filter)

    current.visibleFares = filter(current.visibleFares, scale_filter)
    current.visibleFares = filter(current.visibleFares, schedule_filter)
    current.visibleFares = filter(current.visibleFares, price_filter)

    get_price_ranges(current.visibleFares)
  }

  $scope.set_min_price = function(item) {
    var current = $scope.currentStretch

    current.price_range.min = item.price

    var index = current.prices.indexOf(item)

    if (index == current.prices.length - 1) {
      current.price_range.max = Number.POSITIVE_INFINITY
    } else {
      current.price_range.max = current.prices[index + 1].price
    }
  }

  $scope.get_price_ref = function(item) {
    var element_index = 0
    var current = $scope.currentStretch

    for (var index in $scope.fares) {
      if (current.fares[index].price >= item.price) {
        element_index = index
        break
      }
    }

    return 'fare-' + element_index
  }

  $scope.get_fares_by_price = function(index) {
    var begin = $scope.currentStretch.prices[index]
    var filter
    var current = $scope.currentStretch

    if (current.prices.length > index + 1) {
      var end = current.prices[index + 1]

      filter = function(fare) {
        return fare.price >= begin.price && fare.price < end.price
      }
    } else {
      filter = function(fare) {
        return fare.price >= begin.price
      }
    }

    return current.visibleFares.filter(filter)
  }

  $scope.update = function($event, isEnd) {
    if (!isEnd) return

    if ($event.target.scrollTop + $event.target.clientHeight >= $event.target.scrollHeight * 0.9) {
      next()
    }
  }

  $scope.in_price_range = function(fare) {
    return fare.price >= $scope.currentStretch.price_range.min && fare.price < $scope.currentStretch.price_range.max
  }

  $scope.process_selection = function(fare) {
    var index = $scope.stretchs.indexOf($scope.currentStretch)

    selected_fares.push(fare)

    if (index == $scope.stretchs.length - 1) {
      $scope.open(null, selected_fares)
    } else {
      $scope.go_to_stretch($scope.currentStretchIndex + 1)
      $scope.filter_fares()
    }
  }

  $scope.go_to_stretch = function(index) {
    $scope.currentStretch = $scope.stretchs[index]
    $scope.currentStretchIndex = index

    if (index == 0) {
      for (var i = selected_fares.length + 1; i >= 0; i--) {
        selected_fares.splice(selected_fares.length - 1, i)
      }
    }
  }

  // open modal details
  $scope.open = function(size, fares) {
    var modalInstance = $modal.open({
      location: '/results/details',
      templateUrl: '/templates/details.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        fares: function() {
          return fares
        }
      }
    })

    modalInstance.result.then(function() {
        selected_fares.splice(selected_fares.length - 1, 1)
      },
      function() {
        selected_fares.splice(selected_fares.length - 1, 1)
      })
  }

  $bars.get_fares(function(fares_bars) {
    $scope.fares_bars = fares_bars
  })
}])

clienteAPP.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$location', '$http', 'iata', 'fares', 'fare', function($scope, $modalInstance, $location, $http, iata, fares, $fare) {
  $scope.fares = []
  $scope.total_price = 0

  fares.forEach(function(fare) {
    $fare.details(result_sol, fare.key, function(err, data) {
      $scope.fares.push(data)
      $scope.total_price += parseFloat(data.details.amount)
    })
  })

  $scope.ok = function() {
    $modalInstance.close()
  }

  $scope.purchase = function(key) {
    $fare.setFaresforPurchase($scope.fares)
    $location.path('/compra/')
    $modalInstance.close()
  }

}])

clienteAPP.filter('startFrom', function() {
  return function(input, start) {
    start = +start
    return input.slice(start)
  }
})