var clienteAPP = angular.module('clienteAPP')

$('#eliminar').on('shown.bs.modal', function() {
  $('#myInput').focus()
})

clienteAPP.controller('Reserva', ['$scope', '$http', '$location', 'fare', 'iata', '$filter', 'sData',
  function($scope, $http, $location, $fare, $iata, $filter, sData) {
    $scope.doc_id = ""; //documento de identificación
    $scope.ticketinfo_reserva = "";
    $scope.ticketinfo = "";
    $scope.reserva_active = "";
    $scope.reservas = null;
    $scope.is_reservas = false;

    $scope.sData = sData;

    $scope.buscar = function() {
      console.log($scope.doc_id)
      $scope.is_reservas = false;
      $fare.getReservaCustomer($scope.doc_id)
        .then(function(response) {
          $scope.reservas = response.data;
          $scope.is_reservas = true;
        }, function(eror) {
          $scope.reservas = {};
          $scope.is_reservas = false;
        })
        .then(function() {
          console.log($scope.reservas)
          console.log($scope.is_reservas)
        })
    }

    $scope.eliminar = function() {
      if ($scope.ticketinfo == $scope.ticketinfo_reserva) {
        $fare.removeReserva($scope.reserva_active)
          .then(function(response) {
            console.log("Eliminado")
            $window.location.reload();
          }, function(eror) {
            console.log("NO fue posible eliminar")
          })
      } else {
        console.log("NO eliminado")
      }
      $('#eliminar').modal('hide')
    }

    $scope.set_eliminar = function(id, ticketInfo) {
      $scope.reserva_active = id;
      $scope.ticketinfo_reserva = ticketInfo;
      console.log("eliminando..")
      console.log(id)
    }

    $scope.editar_info = function(index) {
      console.log("editar infor")
      console.log(index)
      $scope.sData.reserva = $scope.reservas[index]
      console.log($scope.sData.reserva)
      $location.path('/update/');
    }
  }
])