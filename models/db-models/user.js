const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const data = require('../../data/index');
const validator=require('validator');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide your username'],
        unique: true,
        minLength: [3, 'username can\'t be less than 3 chars'],
        trim: true
    },
    password: {
        type: String,
        select: false,
        required: [true, 'password is required']
    },
    firstName: {
        type: String,
        required: [true, 'firstNmae is required'],
    },
    lastName: {
        type: String,
        required: [true, 'firstNmae is required'],
    },
    birthDate: {
        type: Date,
        required: [true, 'birthDate is required'],
    },
    gender: {
        required: true,
        enum: ['male', 'female']
    },
    nationality:
    {
        type:[String],
        enum: data.nationalities,
    },
    email:{
        type:[String],
        validate: [ validator.isEmail, 'invalid email' ],
        required:[true,'email is required']
    }

});


const User = mongoose.model('User', userSchema);

export default User;