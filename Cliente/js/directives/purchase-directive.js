clienteAPP
  .directive("adults", function() {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: '../../templates/adults.html'
    }
  });

clienteAPP
  .directive("children", function() {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: '../../templates/children.html'
    }
  });

clienteAPP
  .directive("infant", function() {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: '../../templates/infant.html'
    }
  });