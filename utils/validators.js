const AppError= require('../models/app-error');

function requiredField(f,name){
    if(f===undefined){
        throw new AppError(`${name} is required`,400);
    }
}

function nonEmpty(f,name){
    if(f.length === 0){
        throw new AppError(`${name} can't be empty`,400);
    }
}

module.exports={nonEmpty,requiredField};