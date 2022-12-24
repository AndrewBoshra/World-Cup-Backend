const Stadium = require("../models/db_models/stadium");
const AppError = require("../models/app-error");
const AppResponse = require("../models/app-response");
const utils = require("../utils/index");
const { ofType, requiredField } = require("../utils/validators");
const { createStadiumViewModel } = require("../models/view-models/stadium");
const Match = require("../models/db_models/match");

async function get(req, res) {
    const { id } = req.params;
    const stadium = await Stadium.findById(id);

    if (!stadium) {
        throw new AppError("Stadium not found", 404);
    }

    const data = createStadiumViewModel(stadium);
    new AppResponse(res, data, 200).send();
}

async function getAll(req, res) {
    const stadiums = await Stadium.find();
    const stadiumsVMs = stadiums.map((s) => createStadiumViewModel(s));

    new AppResponse(res, stadiumsVMs, 200).send();
}

async function create(req, res) {
    const body = req.body;
    let image = req.file && req.file.filename;

    body.image = image || "default.jpg";

    const stadium = new Stadium(body);
    await stadium.save();

    const data = createStadiumViewModel(stadium);
    new AppResponse(res, data, 201).send();
}

async function update(req, res) {
    const { body } = req;
    const { id } = req.params;

    let image = req.file && req.file.filename;
    body.image = image;

    let flattenedBody = utils.flattenObject(body);
    const stadium = await Stadium.findByIdAndUpdate(id, flattenedBody, {
        new: true,
    });

    if (!stadium) {
        throw new AppError("stadium not found", 404);
    }

    const data = createStadiumViewModel(stadium);
    new AppResponse(res, data, 200).send();
}

async function deleteStadium(req, res) {
    const { id } = req.params;
    const stadium = await Stadium.findByIdAndDelete(id);
   
    if (!stadium) {
        throw new AppError("stadium not found", 404);
    }
    
    const data = createStadiumViewModel(stadium);
    new AppResponse(res, data, 200).send();
    await Match.deleteMany({stadium});
}

module.exports = {
    get,
    getAll,
    create,
    update,
    deleteStadium,
};
