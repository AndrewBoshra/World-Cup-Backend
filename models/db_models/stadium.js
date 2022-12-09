const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stadiumSchema = new Schema({
    name:{
        required: '{PATH} is required!'
    }
    //TODO : Add image , description 
});


const Stadium = mongoose.model('Stadium', stadiumSchema);

module.exports = Stadium;