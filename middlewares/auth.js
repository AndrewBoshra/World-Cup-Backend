const jwt = require("jsonwebtoken");
const config = require("../config/index");
const AppError = require("../models/app-error");
const User = require("../models/db_models/user");

function isRolesAllowed(userRoles, allowedRoles) {


    if (allowedRoles == undefined) return true;
    return userRoles.filter((role) => allowedRoles.includes(role)).length > 0;
}

function isAuthenticated(allowedRoles) {
    return async function (req, res, next) {
        
        let token = req.header("Authorization");
        if (!token) return next(new AppError("Access Denied!", 401));

        token = token.split(" ")[1]; //" bearer token" -> token
        const verified = await jwt.verify(token, config.JWT_PASSWORD);
        const user = await User.findById(verified.userID);
        if (!user) return next(new AppError("this account was deleted", 404));

        req.user = user;

        if (isRolesAllowed(user.getRoles(), allowedRoles)) {
            return next();
        }
        
        return next(new AppError("Access Denied!", 401));
    };
}
module.exports = { isAuthenticated };
