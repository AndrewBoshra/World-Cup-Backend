const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const teamSchema = new Schema({
    name:{
        required: '{PATH} is required!'
    }
    //TODO : add flag image 
});


const Team = mongoose.model('Team', teamSchema);

module.exports = Team;