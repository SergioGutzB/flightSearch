if (!global.hasOwnProperty('db')) {
  var mongoose = require('mongoose');
  var dbName = 'GDS_DB'

  mongoose.connect('mongodb://localhost/' + dbName);

  global.db = {
    mongoose: mongoose,
    Reserva: require('./Reserva')(mongoose),
  };

}

module.exports = global.db;