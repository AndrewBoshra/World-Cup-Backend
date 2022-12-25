const mongoose = require("mongoose");
const AppError = require("../app-error");
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
            min: 0,
        },
        height: {
            type: Number,
            required: "{PATH} is required!",
            min: 0,
        },
    },
});

const Stadium = mongoose.model("Stadium", stadiumSchema);

Stadium.prototype.validateSeat = function ({ x, y }) {
    if (Number(x) === NaN || Number(x) === NaN) {
        throw new AppError(`x,y must be numbers`);
    }
    if (x < 1) {
        throw new AppError(`x can't be less than 1`);
    }
    if (y < 1) {
        throw new AppError(`y can't be less than 1`);
    }
    const { width, height } = this.VIPlounge;

    if (x > width) {
        throw new AppError(`x can't be greater than ${width}`);
    }
    if (y > height) {
        throw new AppError(`y can't be greater than ${height}`);
    }
};
module.exports = Stadium;
