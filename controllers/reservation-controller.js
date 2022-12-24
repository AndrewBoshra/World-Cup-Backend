const Match = require("../models/db_models/match");
const AppError = require("../models/app-error");
const AppResponse = require("../models/app-response");
const utils = require("../utils/index");
const {
    createReservationViewModel,
} = require("../models/view-models/reservation");
const { createReservationStatus } = require("../models/view-models/match");

async function status(req, res) {
    const { matchId } = req.params;
    const match = await Match.findById(matchId);

    if (!match) {
        throw new AppError("Match not found", 404);
    }

    const data = createReservationStatus(match);
    new AppResponse(res, data, 200).send();
}

async function getAll(req, res) {
    const { matchId } = req.params;

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
    const { matchId } = req.params;
    const { x, y } = req.body;
    const { user } = req;

    const match = await Match.findById(matchId);

    if (!match) {
        throw new AppError("Match not found", 404);
    }

    match.reserve(user.id, x, y);
    await match.save();
    const reservation = match.getUserReservation(user.id);

    new AppResponse(res, createReservationViewModel(reservation), 200).send();
}

async function cancelReservation(req, res) {
    const { matchId } = req.params;
    const { user } = req;
    const match = await Match.findById(matchId);
    if (!match) {
        throw new AppError("match not found", 404);
    }
    match.cancelReservation(user.id);
    await match.save();

    new AppResponse(res, null, 200).send();
}

module.exports = {
    status,
    getAll,
    create,
    cancelReservation,
};
