const Match = require("../models/db_models/match");
const AppError = require("../models/app-error");
const AppResponse = require("../models/app-response");
const utils = require("../utils/index");
const {
    createReservationViewModel,
} = require("../models/view-models/reservation");
const { createReservationStatus } = require("../models/view-models/match");
const { createReservationOrder, isOrderCapture } = require("../utils/payment");
const {
    UnconfirmedReservation,
} = require("../models/db_models/unconfrimed-reservation");

async function createReservationPayment(req, res) {
    const { matchId } = req.params;
    const match = await Match.findById(matchId);

    if (!match) {
        throw new AppError("Match not found", 404);
    }
    const { x, y } = req.body;

    match.canReserve(req.user._id, x, y);

    const paypalOrderId = await createReservationOrder({
        amount: match.seatPrice,
        name: `Seat (${x},${y}) reservation in ${match.name} match`,
    });

    await new UnconfirmedReservation({
        match,
        user: req.user,
        orderId: paypalOrderId,
        seat: { x, y }, //TODO validate x and y  ( add thi mehtod to stad and use it everywhere)
    }).save();

    new AppResponse(res, { paypalOrderId }, 201).send();
}

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

async function captureReservation(req, res) {
    // const { matchId } = req.params;
    const { orderId } = req.body;

    const unconfirmedReservation = await UnconfirmedReservation.findOne({orderId})
    
    if(! unconfirmedReservation ){
        throw new AppError("Invalid orderId",400);
    }
    const captured = await isOrderCapture(orderId);
    
    if(!captured){
        throw new AppError("Payment Error",400);
    }
    const match = await Match.findById(unconfirmedReservation.match);
    match.reserve(unconfirmedReservation.user, unconfirmedReservation.seat.x, unconfirmedReservation.seat.y);
    await match.save();
    
    const reservation = match.getUserReservation(unconfirmedReservation.user);

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
    captureReservation,
    cancelReservation,
    createReservationPayment,
};
