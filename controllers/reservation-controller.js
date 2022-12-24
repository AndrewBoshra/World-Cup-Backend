const Match = require("../models/db_models/match");
const AppError = require("../models/app-error");
const AppResponse = require("../models/app-response");
const utils = require("../utils/index");
const { createReservationViewModel } = require("../models/view-models/reservation");

async function get(req, res) {
    const { matchId, id } = req.params;
    const match = await Match.findById(matchId);

    if (!match) {
        throw new AppError("Match not found", 404);
    }

    const data = createMatchViewModel(match);
    new AppResponse(res, data, 200).send();
}

async function getAll(req, res) {
    const { matchId, id } = req.params;

    const match = await Match.findById(matchId);
    if (!match) {
        throw new AppError("Match not found", 404);
    }
    
    const reservationsVMs = match.reservations.map((r) =>
        createReservationViewModel(r)
    );

    new AppResponse(res, reservationsVMs, 200).send();
}

async function create(req, res) {
    const body = req.body;

    const match = new Match(body);
    await match.save();

    const data = createMatchViewModel(match);
    new AppResponse(res, data, 200).send();
}

async function update(req, res) {
    const { body } = req;
    const { id } = req.params;

    let flattenedBody = utils.flattenObject(body);
    const match = await Match.findById(id);
    if (!match) {
        throw new AppError("match not found", 404);
    }
    const updatedMatch = Object.assign(match, flattenedBody);
    // TODO CHECK RESERVATION WHEN STADIUM IS UPDATED
    await updatedMatch.save();
    const data = createMatchViewModel(updatedMatch);
    new AppResponse(res, data, 201).send();
    // let flattenedBody = utils.flattenObject(body);
    // const match = await Match.findByIdAndUpdate(id, flattenedBody, {
    //     new: true,
    //     runValidators: true,
    //     context:'query'
    // });

    // if (!match) {
    //     throw new AppError("match not found", 404);
    // }

    // const data = createMatchViewModel(match);
    // new AppResponse(res, data, 201).send();
}

async function deleteMatch(req, res) {
    const { id } = req.params;
    const match = await Match.findByIdAndDelete(id);

    if (!match) {
        throw new AppError("match not found", 404);
    }

    const data = createMatchViewModel(match);
    new AppResponse(res, data, 200).send();
}

module.exports = {
    get,
    getAll,
    create,
    update,
    deleteMatch,
};
