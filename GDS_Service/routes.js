var Reserva = require('./models/Reserva');
var Controller = require('./controller');

module.exports = function(app) {
  // devolver todos las Reservas
  app.get('/api/reserva', Controller.getReserva);
  // devolver todos las Reservas
  app.get('/api/reserva/:customer_id', Controller.getReservaCustomer);
  // Crear una nueva Persona
  app.post('/api/reserva', Controller.setReserva);
  // Modificar los datos de una Persona
  app.put('/api/reserva/:reserva_id', Controller.updateReserva);
  // Borrar una Persona
  app.delete('/api/reserva/:reserva_id', Controller.removeReserva);
};