const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reservation = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: "{PATH} is required!",
    },
    match: {
        type: Schema.Types.ObjectId,
        ref: "Match",
        required: "{PATH} is required!",
    },
    seat: {
        x: Number,
        y: Number,
    },
    orderId: String
});


const UnconfirmedReservation = mongoose.model(
    "UnconfirmedReservation",
    reservation
);

module.exports = { UnconfirmedReservation };
