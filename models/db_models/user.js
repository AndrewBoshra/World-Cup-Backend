const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const data = require('../../data/index');
const validator=require('validator');

const rolesSchema = new Schema({
    role: {
        type: String,
        required: true,
        enum:['Admin','Manager','Fan']
    }
}); 

const userSchema = new Schema({
    username: {
        type: String,
        required: '{PATH} is required!',
        unique: true,
        minLength: [3, '{PATH} can\'t be less than 3 chars'],
        trim: true
    },
    password: {
        type: String,
        select: false,
        required: '{PATH} is required!'
    },
    firstName: {
        type: String,
        required: '{PATH} is required!',
    },
    lastName: {
        type: String,
        required: '{PATH} is required!',
    },
    birthDate: {
        type: Date,
        required: '{PATH} is required!',
    },
    gender: {
        type:[String],
        required: '{PATH} is required!',
        enum: ['male', 'female']
    },
    nationality:
    {
        type:[String],
        enum: data.nationalities,
    },
    email:{
        type:[String],
        validate: [ validator.isEmail, 'invalid {PATH}' ],
        required:'{PATH} is required'
    },
    roles: [rolesSchema]

});


const User = mongoose.model('User', userSchema);

module.exports = User;

/*
    roles:[
        {role: "Admin"},
        {role: "Fan"}
    ]
*/