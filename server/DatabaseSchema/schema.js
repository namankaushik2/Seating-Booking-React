const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017";
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => "Connected to DB!"
);

// Schema for Seats Arrangement
const seatSchema = mongoose.Schema({
  seats: [],
  remainingSeats: Number,
});
seatSchema.set("collection", "seats");
const seatUpdate = mongoose.model("seats", seatSchema);

// Schema for booking
const bookingSchema = mongoose.Schema({
  user: String,
  seats: Number,
});
bookingSchema.set("collection", "booking");
const booking = mongoose.model("booking", bookingSchema);

module.exports.URI = uri;
// module.exports.Seats = seatUpdate;
// module.exports.Booking = booking;

