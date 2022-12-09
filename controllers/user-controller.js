const User = require("../models/db_models/user");
const AppError = require("../models/app-error");
const AppResponse = require("../models/app-response");
const utils = require("../utils/index");
const { createUserViewModel } = require("../models/view-models/user");

async function get(req, res) {
    const { user } = req;
    const data = createUserViewModel(user);
    new AppResponse(res, data, 200).send();
}
async function getAll(req, res) {
    const { user } = req;
    const data = createUserViewModel(user);
    new AppResponse(res, data, 200).send();
}

async function updateRole(req, res) {
    const { user } = req;
    const data = createUserViewModel(user);
    new AppResponse(res, data, 200).send();
}
async function selfUpdate(req, res) {
    const { user } = req;

    const { firstName, lastName, nationality } = utils.readKeys([
        "firstName",
        "lastName",
        "nationality",
    ],req.body);

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.nationality = nationality || user.nationality;
    
    await user.save();

    const data = createUserViewModel(user);
    new AppResponse(res, data, 200).send();
}

async function deleteUser(req, res) {
    const { user } = req;
    const data = createUserViewModel(user);
    new AppResponse(res, data, 200).send();
}

module.exports = {
    get,
    getAll,
    updateRole,
    selfUpdate,
    deleteUser,
};
