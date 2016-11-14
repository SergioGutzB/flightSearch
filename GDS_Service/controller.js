var Reserva = require('./models/Reserva');

// Obtiene todos los objetos Reserva de la base de datos
exports.getReserva = function(req, res) {
  Reserva.find(
    function(err, reserva) {
      if (err)
        res.send(err)
      res.json(reserva); // devuelve todas las Reservas en JSON		
    }
  );
}

// Obtiene todos los objetos Reserva de la base de datos
exports.getReservaCustomer = function(req, res) {
  console.log("getReservaCustomer")
  console.log(req.params.customer_id)
  Reserva.find({ "customerInformation.identifier": req.params.customer_id },
    function(err, reserva) {
      if (err)
        res.send(err)
      res.json(reserva); // devuelve todas las Reservas en JSON		
    }
  );
}

// Obtiene todos los objetos Reserva de la base de datos
exports.getReservaID = function(req, res) {
  console.log("getReservaID")
  console.log(req.params.reserva_id)
  Reserva.find({ _id: req.params.reserva_id },
    function(err, reserva) {
      if (err)
        res.send(err)
      res.json(reserva); // devuelve todas las Reservas en JSON		
    }
  );
}

// Guarda un objeto Reserva en base de datos
exports.setReserva = function(req, res) {
  var u = req.body
  Reserva.create(u,
    function(err, reserva) {
      if (err)
        res.send(err);
      Reserva.find(function(err, reserva) {
        if (err)
          res.send(err)
        res.json(reserva);
      });
    });

}

// Modificamos un objeto Reserva de la base de datos
exports.updateReserva = function(req, res) {
  console.log("updateReserva")
  console.log(req.params.reserva_id)
  var u = req.body
  Reserva.update({ _id: req.params.reserva_id }, { $set: u },
    function(err, reserva) {
      if (err)
        res.send(err);
      // Obtine y devuelve todas las Reservas tras crear una de ellas
      Reserva.find(function(err, reserva) {
        if (err)
          res.send(err)
        res.json(reserva);
      });
    });
}

// Elimino un objeto Reserva de la base de Datos
exports.removeReserva = function(req, res) {
  console.log("removeReserva")
  console.log(req.params.reserva_id)
  Reserva.remove({ _id: req.params.reserva_id }, function(err, reserva) {
    if (err)
      res.send(err);
    // Obtine y devuelve todas las Reservas tras borrar una de ellas
    Reserva.find(function(err, reserva) {
      if (err)
        res.send(err)
      res.json(reserva);
    });
  });
}