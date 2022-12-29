const validator = require("validator");
const bcrypt = require("bcrypt");
const AppError= require("../models/app-error");
function isStrongPassword(pwd) {
    return validator.isStrongPassword(pwd, {
        minLength: 8,
        minLowercase: 0,
        minNumbers: 0,
        minSymbols: 0,
        minUppercase: 0,
    });
}

module.exports = {
    setPassword: async function (user, passwordRaw) {
        if (!isStrongPassword(passwordRaw)) {
            throw new AppError("password must have at least 8 characters", 400);
        }
        user.password = await bcrypt.hash(passwordRaw, 10);
    },
    validPassword: async function (user, password) {
        return await bcrypt.compare(password, user.password);
    },
};
