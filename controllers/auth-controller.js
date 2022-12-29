const User = require("../models/db_models/user");
const AppError = require("../models/app-error");
const AppResponse = require("../models/app-response");
const utils = require("../utils/index");
const { createUserViewModel } = require("../models/view-models/user");
const { requiredField, nonEmpty } = require("../utils/validators");
const UserManager = require("../services/user-manager");

async function register(req, res) {
    const passwordRaw = req.body.password;
    if (!passwordRaw) {
        throw new AppError("password is required", 400);
    }

    const body = utils.readKeys(
        [
            "username",
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
    await UserManager.setPassword(user, req.body.password);
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
    const correctPwd = await UserManager.validPassword(user, password);

    if (!correctPwd) {
        throw new AppError("wrong password", 401);
    }
    const data = {
        ...createUserViewModel(user),
        token: await user.getToken(),
    };

    new AppResponse(res, data, 200).send();
}

async function resetPassword(req, res) {
    const { password, passwordConfirm, oldPassword } = req.body;

    requiredField(password, "password");
    nonEmpty(password, "password");
    requiredField(passwordConfirm, "passwordConfirm");
    nonEmpty(passwordConfirm, "passwordConfirm");
    requiredField(oldPassword, "oldPassword");
    nonEmpty(oldPassword, "oldPassword");

    if (password !== passwordConfirm) {
        throw new AppError("password and confirm password must match", 400);
    }

    const user = await User.findById(req.user.id).select("+password");
    

    const correctPwd = await UserManager.validPassword(user, oldPassword);

    if (!correctPwd) {
        throw new AppError("wrong password", 401);
    }

    await UserManager.setPassword(user, password);

    await user.save();

    const data = {
        token: await user.getToken(),
    };
    new AppResponse(res, data, 200).send();
}

module.exports = {
    register,
    login,
    resetPassword,
};
