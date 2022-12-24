const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stadiumSchema = new Schema({
    name: {
        type: String,
        required: "{PATH} is required!",
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        required: "{PATH} is required!",
    },
    VIPlounge: {
        width: {
            type: Number,
            required: "{PATH} is required!",
            min:0,
        },
        height: {
            type: Number,
            required: "{PATH} is required!",
            min:0,
        },
    },
});

const Stadium = mongoose.model("Stadium", stadiumSchema);

module.exports = Stadium;
