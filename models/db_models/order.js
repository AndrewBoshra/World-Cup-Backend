const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const order = new Schema({
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
    seats: [
        {
            x: Number,
            y: Number,
        },
    ],
    orderId: String,
    captureId: String,
    isConfirmed: {
        type: Boolean,
        default:false,
    },
},{timestamps:true});


const Order = mongoose.model("Order", order);

module.exports = {  Order };
