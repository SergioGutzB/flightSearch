var clienteAPP = angular.module('clienteAPP');
clienteAPP.controller('Purchase', ['$scope', '$http', '$filter', '$modal', 'fare', 'iata', '$location', 'sData', function($scope, $http, $filter, $modal, fare, $iata, $location, sData) {
  // if ($location.$$url === '/volaires/compra/Rv2331/'){
  $scope.sData = sData;


  /* Until $scope.on to keep fare or rate data in session in case of reload */
  if (sessionStorage.service == 'Air') {
    if (sessionStorage.fares) {
      $scope.fares = JSON.parse(sessionStorage.fares);
      $scope.dataSource = $scope.fares[0].details;
      console.log($scope.dataSource)
      $scope.type = 'Air';
    } else if ($scope.sData.reserva) {
      $scope.data = $scope.sData.reserva
      console.log($scope.data)
      $scope.dataSource = { passenger: $scope.sData.reserva.passengers };
    }
  } else {
    $scope.rate = JSON.parse(sessionStorage.rate);
    $scope.dataSource = $scope.rate;
  }




  $scope.$on('$locationChangeStart', function(event) {
    sessionStorage.removeItem('fares');
    sessionStorage.removeItem('rate');
  });

  /* Vars to save data of all passengers */
  if (sessionStorage.fares) {
    $scope.adultsInfo = getPassenger('ADT');
    $scope.childrenInfo = getPassenger('CHD');
    $scope.infantsInfo = getPassenger('INF');
    $scope.currentYear = new Date().getFullYear();
    $scope.data = {};
  } else {
    $scope.adultsInfo = _.filter($scope.sData.reserva.passengerInformation, { types: 'ADT' });
    console.log($scope.adultsInfo)
    $scope.childrenInfo = _.filter($scope.sData.reserva.passengerInformation, { types: 'CHD' });
    console.log($scope.childrenInfo)
    $scope.infantsInfo = _.filter($scope.sData.reserva.passengerInformation, { types: 'INF' });
    console.log($scope.infantsInfo)
    $scope.currentYear = new Date().getFullYear();
    $scope.card_owner_name = $scope.sData.reserva.customerInformation.name
    $scope.card_owner_lastname = $scope.sData.reserva.customerInformation.lastname
    $scope.card_owner_gender = $scope.sData.reserva.customerInformation.gender
    $scope.card_owner_address = $scope.sData.reserva.customerInformation.address
    $scope.card_owner_id = $scope.sData.reserva.customerInformation.identifier
    $scope.email = $scope.sData.reserva.customerInformation.email
    $scope.cellphone = $scope.sData.reserva.customerInformation.cellphone
    $scope.phone = $scope.sData.reserva.customerInformation.phone
    $scope.country = $scope.sData.reserva.customerInformation.country
    $scope.city = $scope.sData.reserva.customerInformation.city
  }


  $scope.purchase = false;
  $scope.validation = {
    text: /^[\w ]+$/
  };

  if (sessionStorage.fares) {
    get_detail_info(sessionStorage.service);
    get_detail_airport(sessionStorage.service);

    createTransactionPayment();
  }

  function get_detail_airport(service) {
    var destinationCountry;
    $iata.get_airports_all(function(airports_all) {
      if (service == 'Air') {
        // Get the last segment index
        destinationCountry = airports_all.airport_codes.find(function(airport) {
          return airport.iata === $scope.fares[0].destination_city;
        });
        originCountry = airports_all.airport_codes.find(function(airport) {
          return airport.iata === $scope.fares[0].origin_city;
        });

        $scope.destinationCountry = destinationCountry ? destinationCountry.iso : null;
        $scope.originCountry = originCountry ? originCountry.iso : null;

        // If destination isn't Colombia then the flight is international
        //$scope.isAnInternationalFlight = destinationCountry && destinationCountry.iso !== 'CO'? true : false;
        console.log($scope.destinationCountry, $scope.originCountry)
        $scope.isAnInternationalFlight = !($scope.destinationCountry == 'CO' && $scope.originCountry == 'CO');

        // Log only for testing purposes
        console.log('is international', $scope.isAnInternationalFlight);
      }
    });
  }

  /* Constructs trip detail data to show on form */
  function get_detail_info(service) {
    $iata.get_airports(function(airports) {
      $scope.destination_airport = [];
      $scope.origin_airport = [];
      $scope.airports = [];
      $scope.total_amount = 0;
      $scope.total_taxes = 0;
      if (service == 'Air') {
        for (index in $scope.fares) {
          $scope.total_amount += parseInt($scope.fares[index].details.amount);
          $scope.total_taxes += parseInt($scope.fares[index].taxes);
          $scope.airports.push($filter('filter')(airports, { code: $scope.fares[index].details.trips[0].segments[0].origin.code })[0]);
          $scope.total_volaires = 10000;
        }
      } else {
        $scope.total_amount = $scope.rate.detail.totalPrice;
        $scope.total_taxes = $scope.rate.detail.taxes;
        $scope.hotel_city = $scope.rate.destination;
        $scope.total_volaires = 10000;
      }
    });
  }

  /* Creates a transaction and requested the fingerprint */
  function createTransactionPayment() {
    if ($scope.transaction) {
      return;
    }
    var tr_prefix;
    tr_prefix = (sessionStorage.service == 'VL-AR-') ? '1' : 'VL-OT-';

    // Create a transacction code using the timestamp in seconds + Random number
    $scope.transaction = {
      code: tr_prefix +
        Math.round((new Date()).getTime() / 1000) // Timestamp in seconds
        +
        '' +
        Math.round(Math.random() * 1000) // Random number
    };
    console.log($scope.transaction.code);
    setTimeout(function() {
      initDFP($scope.transaction.code);
    }, 5000);
  }

  /* Basic structure for all passengers */
  function getPassenger(pass) {
    passenger = [{
      firstName: "",
      lastName: "",
      id: "",
      monthBirth: "",
      yearBirth: "",
      dayBirth: "",
      types: pass,
      gender: "",
      passport: ""
    }];
    return passenger;
  }

  $scope.reservar = function() {
    if (sessionStorage.fares) {
      $scope.transaction.amount = $scope.total_amount;
      $scope.transaction.taxes = $scope.total_taxes;
      $scope.transaction.volaires = $scope.total_volaires;
      $scope.data = {
        customerInformation: {
          name: $scope.card_owner_name,
          lastname: $scope.card_owner_lastname,
          gender: $scope.card_owner_gender,
          address: $scope.card_owner_address,
          identifier: $scope.card_owner_id,
          email: $scope.email,
          cellphone: $scope.cellphone,
          phone: $scope.phone,
          country: $scope.country,
          city: $scope.city
        },
        passengers: {
          adults: $scope.dataSource.passengers.adults,
          child: $scope.dataSource.passengers.child,
          infant: $scope.dataSource.passengers.infant
        },
        passengerInformation: concatenate(),
        transaction: $scope.transaction
      };
      completeData();
    } else {
      $scope.data.customerInformation = {
        name: $scope.card_owner_name,
        lastname: $scope.card_owner_lastname,
        gender: $scope.card_owner_gender,
        address: $scope.card_owner_address,
        identifier: $scope.card_owner_id,
        email: $scope.email,
        cellphone: $scope.cellphone,
        phone: $scope.phone,
        country: $scope.country,
        city: $scope.city
      };
      $scope.data.passengers = {
        adults: $scope.dataSource.passenger.adults,
        child: $scope.dataSource.passenger.child,
        infant: $scope.dataSource.passenger.infant
      };
      $scope.data.passengerInformation = concatenate();
      $scope.data.transaction = $scope.transaction;
    var caracteres = "0123456789QWERTYUIOPLKJHGFDSAZXCVBNM";
    $scope.data.ticketInfo = rand_code(caracteres, 6);

    book_update($scope.data);

  }

}

function concatenate() {
  passInfo = $scope.adultsInfo;
  if ($scope.dataSource.passenger.child > 0) {
    passInfo = passInfo.concat($scope.childrenInfo);
  }
  if ($scope.dataSource.passenger.infant > 0) {
    passInfo = passInfo.concat($scope.infantsInfo);
  }
  return passInfo;
}

function rand_code(chars, lon) {
  code = "";
  for (x = 0; x < lon; x++) {
    rand = Math.floor(Math.random() * chars.length);
    code += chars.substr(rand, 1);
  }
  return code;
}

function completeData(data) {
  if (sessionStorage.service == 'Air') {
    $scope.data.segments = [];
    for (i in $scope.fares) {
      aux = [];
      for (index in $scope.fares[i].details.trips[0].segments) {
        segment = {};
        segment['airline'] = $scope.fares[i].details.trips[0].segments[index].airline.code;
        segment['origin'] = $scope.fares[i].details.trips[0].segments[index].origin.code;
        segment['destination'] = $scope.fares[i].details.trips[0].segments[index].destination.code;
        segment['departureDate'] = $scope.fares[i].details.trips[0].segments[index].departure_date;
        segment['arrivalDate'] = $scope.fares[i].details.trips[0].segments[index].arrival_date;
        segment['flightNumber'] = $scope.fares[i].details.trips[0].segments[index].flight_number;
        segment['bookingClass'] = $scope.fares[i].details.trips[0].segments[index].bookingClass;
        aux.push(segment);
      }
      $scope.data.segments.unshift(aux);
    }
    dataJs = JSON.stringify($scope.data);
    var caracteres = "0123456789QWERTYUIOPLKJHGFDSAZXCVBNM";
    $scope.data.ticketInfo = rand_code(caracteres, 6);

    book($scope.data);
  }
}

function openPurchase(data, response) {
  var modalInstance = $modal.open({
    templateUrl: '/templates/modal_purchase.html',
    controller: 'ModalInstanceCtrl2',
    size: 'lg',
    resolve: {
      data: function() {
        return data;
      },
      response: function() {
        return response;
      },
      type: function() {
        return 'Ok';
      }
    }
  });
  modalInstance.result.then(function() {}, function() {

  });
};


function openErrorPurchase(data, response) {
  var modalInstance = $modal.open({
    templateUrl: '/templates/modal_error_purchase.html',
    controller: 'ModalInstanceCtrl2',
    size: 'lg',
    resolve: {
      data: function() {
        return data;
      },
      response: function() {
        return response;
      },
      type: function() {
        return 'Error';
      }
    }
  });
  modalInstance.result.then(function() {}, function() {

  });
};



/* Makes request to book air or hotel */
function book(data_json) {
  console.log(data_json);

  fare.setReserva($scope.data)
    .then(function(response) {
      console.log("Reserva realizada")
      console.log(response.data)
      openPurchase($scope.data, $scope.data);
    }, function(error) {
      console.log("La Reserva no fue realizada")
      console.log(error)
      openErrorPurchase($scope.data, $scope.data);
    });

}

function book_update(data_json) {
  console.log(data_json);

  fare.updateReserva($scope.data)
    .then(function(response) {
      console.log("Reserva actualizada")
      console.log(response.data)
      openPurchase($scope.data, $scope.data);
    }, function(error) {
      console.log("La Reserva no fue actualizada")
      console.log(error)
      openErrorPurchase($scope.data, $scope.data);
    });

}

/* Next functions restrict choices of birth dates depending on the type of passenger */
$scope.pickDay = function(index, type) {
  days = [];
  for (i = 1; i <= 31; i++) {
    days.push(i);
  }
  if (type == 0) x = $scope.adultsInfo[index];
  else if (type == 1) x = $scope.childrenInfo[index];
  else x = $scope.infantsInfo[index];

  if (x.monthBirth == 4 || x.monthBirth == 6 || x.monthBirth == 9 || x.monthBirth == 11) {
    days.splice(30, 1);
  } else {
    if (x.monthBirth == 2) {
      if (x.yearBirth % 4 == 0) {
        days.splice(29, 2);
      } else {
        days.splice(28, 3);
      }
    }
  }
  return days;
};

$scope.pickMonth = function(index, type, max, min) {
  months = [];
  date = new Date();
  for (i = 1; i <= 12; i++) {
    months.push(i);
  }
  if (type == 1) x = $scope.childrenInfo[index];
  else x = $scope.infantsInfo[index];

  if (x.yearBirth == date.getFullYear() - max) {
    months.splice(0, date.getMonth());
  } else {
    if (x.yearBirth == date.getFullYear() - min) {
      months.splice(date.getMonth() + 1, 11 - date.getMonth());
    }
  }
  return months;
};

$scope.restrictDays = function(index, type, max, min) {
  days = $scope.pickDay(index, type);
  date = new Date();
  if (type == 1) x = $scope.childrenInfo[index];
  else x = $scope.infantsInfo[index];

  if (x.yearBirth == date.getFullYear() - max) {
    if (x.monthBirth == date.getMonth() + 1) {
      days.splice(0, date.getDate());
    }
  } else {
    if (x.yearBirth == date.getFullYear() - min) {
      if (x.monthBirth == date.getMonth() + 1) {
        days = days.slice(0, date.getDate() - 1);
      }
    }
  }
  return days;
};

$scope.range = function(range) {
  range = parseInt(range);    
  array = [];    
  for (var i = 0; i <= range - 1; i++) {       array.push(i);     }    
  return array;  
};

$scope.open = function(size) {
  history.back();
  var modalInstance = $modal.open({
    location: '/results/details',
    templateUrl: '/templates/details.html',
    controller: 'ModalInstanceCtrl',
    size: size,
    resolve: {
      fares: function() {
        return $scope.fares;
      }
    }
  });
}

if ($location.path() == "/compra/") {
  angular.element(document.getElementById("footer")).removeClass('hid');
}

}]);


clienteAPP.controller('ModalInstanceCtrl2', ['$scope', '$modalInstance', '$location', '$http', 'data', 'response', 'type', function($scope, $modalInstance, $location, $http, data, response, type) {

  $scope.ok = function() {
    $modalInstance.close();
    $location.path('/reservas/');
  };

  $scope.statePurchase = data;
  if (type === 'Error') {
    try {
      $scope.messagesError = data.data.map(function(d) { return d.message }).join(' ');
    } catch (e) {
      console.log("Error: " + e);
    }
  }
}]);