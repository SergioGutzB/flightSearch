$(document).ready(function() {

  var options = {};

  options['oneWay'] = function(){
    $("#return_date").addClass("hid");
    $("#days").addClass("hid");

    $( "#departure_date" ).datepicker( "option", "maxDate", null);
  }

  options['roundTrip'] = function(){
    var end_date = $( "#end_date" ).datepicker( "getDate");
    
    $('#return_date').removeClass('hid');
    $('#days').removeClass('hid');
  }

  $("input[name='flightOption']").change(function(){
    options[this.value]();
  });

});