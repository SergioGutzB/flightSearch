var mongoose = require('mongoose');

module.exports = mongoose.model('Reserva', {
  customerInformation: {
    address: String,
    cellphone: String,
    city: String,
    country: String,
    email: String,
    gender: String,
    identifier: String,
    lastname: String,
    name: String,
    phone: String,
  },
  passengerInformation: [{
    dayBirth: String,
    firstName: String,
    gender: String,
    id: Number,
    lastName: String,
    monthBirth: String,
    passport: String,
    types: String,
    yearBirth: String,
  }],
  passengers: {
    adults: String,
    child: String,
    infant: String,
  },
  segments: [
    [{
      airline: String,
      arrivalDate: String,
      bookingClass: String,
      departureDate: String,
      destination: String,
      flightNumber: String,
      origin: String,
    }]
  ],
  ticketInfo: String,
  transaction: {
    amount: String,
    code: String,
    taxes: String,
    volaires: String,
  }
})