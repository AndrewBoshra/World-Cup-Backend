const Match = require("../models/db_models/match");
const AppError = require("../models/app-error");
const AppResponse = require("../models/app-response");
const utils = require("../utils/index");
const {
    createReservationViewModel,
} = require("../models/view-models/reservation");
const { createReservationStatus } = require("../models/view-models/match");
const {
    createReservationOrder,
    captureOrder,
    refundOrder,
} = require("../services/payment");
const { Order } = require("../models/db_models/order");
const { createOrderViewModel } = require("../models/view-models/order");

async function createReservationPayment(req, res) {
    const { matchId } = req.params;
    const match = await Match.findById(matchId);

    if (!match) {
        throw new AppError("Match not found", 404);
    }
    const { seats } = req.body;

    for (const seat of seats) {
        const { x, y } = seat;
        match.canReserve(x, y);
    }

    const paypalOrderId = await createReservationOrder(match, seats);

    await new Order({
        match,
        user: req.user,
        orderId: paypalOrderId,
        seats,
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

    const order = await Order.findOne({ orderId, isConfirmed: false });

    if (!order) {
        throw new AppError("orderId doesn't exist or already captured", 400);
    }

    const { captured, captureId } = await captureOrder(orderId);

    if (!captured) {
        throw new AppError("Payment Error", 400);
    }

    const match = await Match.findById(order.match);
    // if (!req.user._id.equals(order.id)) {
    //     throw new AppError("Not your Order", 400);
    // }
    const { user, seats } = order;
    const reservations = [];
    for (let seat of seats) {
        const reservation = match.reserve(user, seat.x, seat.y);
        reservation.orderId = orderId;
        reservation.captureId = captureId;
        reservations.push(reservation);
    }
    order.isConfirmed = true;
    order.captureId = captureId;

    await order.save();
    await match.save();

    new AppResponse(
        res,
        reservations.map(createReservationViewModel),
        200
    ).send();
}

async function cancelReservation(req, res) {
    const { matchId, orderId } = req.params;
    const { user } = req;

    const order = await Order.findOne({
        orderId,
        isConfirmed: true,
        user: user,
    });

    if (!order) {
        throw new AppError("order not found", 404);
    }

    const match = await Match.findById(order.match);

    for (const seat of order.seats) {
        match.cancelReservationWithSeat(seat.x, seat.y);
    }

    await match.save();
    await order.delete();
    await refundOrder(order.captureId);
    new AppResponse(res, null, 200).send();
}

async function getUserReservations(req,res){
    const { user } = req;
    const orders = await Order.find({ user }).sort("-updatedAt").populate("match");

    new AppResponse(res, orders.map(createOrderViewModel), 200).send();

}

module.exports = {
    status,
    getAll,
    captureReservation,
    cancelReservation,
    createReservationPayment,
    getUserReservations,
};
