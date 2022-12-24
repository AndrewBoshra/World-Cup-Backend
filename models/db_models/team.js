const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const teamSchema = new Schema({
    name: {
        type: String,
        required: "{PATH} is required!",
    },
    flag: {
        type: String,
        required: "{PATH} is required!",
    },
});


const Team = mongoose.model('Team', teamSchema);

module.exports = Team;