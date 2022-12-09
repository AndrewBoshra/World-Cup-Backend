const data=require('../data/index');
const AppResponse = require("../models/app-response");


module.exports = {
    getNationalities: async (req,res)=>{
        new AppResponse(res,data.nationalities,200)
    }
}