const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    team1: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: '{PATH} is required!'
    },
    team2: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: '{PATH} is required!'
    },
    stadium: {
        type: Schema.Types.ObjectId,
        ref: 'Stadium',
        required: '{PATH} is required!'
    },
    date: {
        type: Date,
        required: '{PATH} is required!',
    },
    mainReferee: {
        type: String,
        required: '{PATH} is required!',
    },
    linesMan1: {
        type: String,
        required: '{PATH} is required!',
        minLength: [3, '{PATH} can\'t be less than 3 chars'],
        trim: true
    },
    linesMan2: {
        type: String,
        required: '{PATH} is required!',
        minLength: [3, '{PATH} can\'t be less than 3 chars'],
        trim: true
    },
});


const Match = mongoose.model('Match', matchSchema);

module.exports = Match;