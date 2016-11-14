var Reserva = require('./models/Reserva');
var Controller_Reserva = require('./controller_reserva');
var Controller_GDS = require('./controller_GDS');

module.exports = function(app) {
  // devolver todos las Reservas
  app.get('/api/reserva', Controller_Reserva.getReserva);
  // devolver todos las Reservas
  app.get('/api/reserva/:customer_id', Controller_Reserva.getReservaCustomer);
  // Crear una nueva Persona
  app.post('/api/reserva', Controller_Reserva.setReserva);
  // Modificar los datos de una Reservas
  app.put('/api/reserva/:reserva_id', Controller_Reserva.updateReserva);
  // Borrar una Reservas
  app.delete('/api/reserva/:reserva_id', Controller_Reserva.removeReserva);
  // Buscar vuelos
  app.get('/api/search/', Controller_GDS.getSearch);
  // Mostrar vuelos por pagina  
  app.post('/api/result/pages/', Controller_GDS.setPages);
  // Mostrar detalles de un vuelo
  app.post('/api/results/details/', Controller_GDS.setDetails);
};