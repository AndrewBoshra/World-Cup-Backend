const mongoose= require('mongoose');

const User =require('./models/db_models/user')


const u = new User();
u.validate();
console.log(u);
