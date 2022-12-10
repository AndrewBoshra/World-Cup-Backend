const User = require("../models/db_models/user");
const AppError = require("../models/app-error");
const AppResponse = require("../models/app-response");
const utils = require("../utils/index");
const { ofType, requiredField } = require("../utils/validators");
const { createUserViewModel } = require("../models/view-models/user");

async function get(req, res) {
    const { user } = req;
    const data = createUserViewModel(user);
    new AppResponse(res, data, 200).send();
}
async function getAll(req, res) {
    const users = await User.find({
        "roles.role": {
            $ne: "Admin",
        },
    });
    const usersVMs = users.map((u) => createUserViewModel(u));

    new AppResponse(res, usersVMs, 200).send();
}

async function updateRole(req, res) {
    const { isManager, isFan } = req.body;
    const { id } = req.params;

    requiredField(isManager, "isManager");
    ofType(isManager, "boolean", "isManager");
    requiredField(isFan, "isFan");
    ofType(isFan, "boolean", "isFan");

    const user = await User.findById(id);
    if (!user) {
        throw new AppError("user not found", 404);
    }

    if (isManager && !user.getRoles().includes("Manager")) {
        user.roles.push({
            role: "Manager",
        });
    }
    if (!isManager) {
        user.roles = user.roles.filter((r) => r.role !== "Manager");
    }
    if (isFan && !user.getRoles().includes("Fan")) {
        user.roles.push({
            role: "Fan",
        });
    }
    if (!isFan) {
        user.roles = user.roles.filter((r) => r.role !== "Fan");
    }

    await user.save();

    const data = createUserViewModel(user);
    new AppResponse(res, data, 200).send();
}

async function selfUpdate(req, res) {
    const { user } = req;

    const { firstName, lastName, nationality } = utils.readKeys(
        ["firstName", "lastName", "nationality"],
        req.body
    );

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.nationality = nationality || user.nationality;

    await user.save();

    const data = createUserViewModel(user);
    new AppResponse(res, data, 200).send();
}

async function deleteUser(req, res) {
    const { id } = req.params;
    const user = await User.findOneAndDelete({
        _id: id,
        "roles.role": {
            $ne: "Admin",
        },
    });
    if (!user) {
        throw new AppError("user not found", 404);
    }
    const del = createUserViewModel(user);
    new AppResponse(res, del, 200).send();
}

module.exports = {
    get,
    getAll,
    updateRole,
    selfUpdate,
    deleteUser,
};
