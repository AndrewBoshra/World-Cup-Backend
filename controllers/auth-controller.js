const bcrypt = require("bcrypt");
const User = require("../models/db_models/user");
const validator = require("validator");
const AppError = require("../models/app-error");
const AppResponse = require("../models/app-response");
const utils = require("../utils/index");
const { createUserViewModel } = require("../models/view-models/user");
const { requiredField, nonEmpty } = require("../utils/validators");

function isStrongPassword(pwd) {
    return validator.isStrongPassword(pwd, {
        minLength: 8,
        minLowercase: 0,
        minNumbers: 0,
        minSymbols: 0,
        minUppercase: 0,
    });
}

async function register(req, res) {
    const passwordRaw = req.body.password;
    if (!passwordRaw) {
        throw new AppError("password is required", 400);
    }
    if (!isStrongPassword(passwordRaw)) {
        throw new AppError("password must have at least 8 characters", 400);
    }

    req.body.password = await bcrypt.hash(passwordRaw, 10);

    const body = utils.readKeys(
        [
            "username",
            "password",
            "firstName",
            "lastName",
            "birthDate",
            "gender",
            "nationality",
            "email",
        ],
        req.body
    );

    body.roles = [
        {
            role: "Fan",
        },
    ];

    const user = new User(body);
    await user.save();
    const userVM = createUserViewModel(user);
    const responseData = { ...userVM, token: await user.getToken() };
    new AppResponse(res, responseData, 200).send();
}

async function login(req, res) {
    const { password, email } = req.body;

    requiredField(password, "password");
    nonEmpty(password, "password");
    requiredField(email, "email");
    nonEmpty(email, "email");

    const user = await User.findOne({
        email,
    }).select("+password");

    if (!user) {
        throw new AppError("user not found", 404);
    }
    const correctPwd = await bcrypt.compare(password, user.password);

    if (!correctPwd) {
        throw new AppError("wrong password", 401);
    }
    const data = {
        ...createUserViewModel(user),
        token: await user.getToken(),
    };

    new AppResponse(res, data, 200).send();
}

module.exports = {
    register,
    login,
};
