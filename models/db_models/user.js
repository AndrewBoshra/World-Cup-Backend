const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const data = require('../../data/index');
const validator=require('validator');
const config=require('../../config/index')
const jwt=require('jsonwebtoken')

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
        type: String,
        required: '{PATH} is required!',
        enum: ['male', 'female']
    },
    nationality:
    {
        type:String,
        enum: data.nationalities,
    },
    email:{
        type:String,
        required:'{PATH} is required',
        validate: [ validator.isEmail, 'invalid email' ],
        unique: true,
    },
    roles:{
        type:[rolesSchema],
        // autopopulate: true
    } 

});
// userSchema.plugin(require('mongoose-autopopulate'));

const User = mongoose.model('User', userSchema);
/**
 * @returns array of user rules eg: ['fan','manager']
 */
User.prototype.getRoles=function () {
    return this.roles.map(r=>r.role);
}

/**
 * @returns true if user is admin
 */
User.prototype.isAdmin=function () {
    return this.getRoles().includes("Admin");
}
/**
 * @returns true if user is manager
 */
User.prototype.isManager=function () {
    return this.getRoles().includes("Manager");
}

User.prototype.getToken=async function () {
    const payload = {
        userID: this._id,
        isAdmin: this.isAdmin(),
        isManager: this.isManager(),
    };
    const token = jwt.sign(payload, config.JWT_PASSWORD, {
		expiresIn: '24h',
	});
	return token;
}

module.exports = User;

