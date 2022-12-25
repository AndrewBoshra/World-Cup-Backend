const paypal = require("@paypal/checkout-server-sdk");
const config = require("../config/index");
const AppError = require("../models/app-error");

let paypalClient = new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(
        config.PAYPAL_CLIENT_ID,
        config.PAYPAL_CLIENT_SECRET
    )
);

function buildOrderBody(match, seats) {
    const { seatPrice } = match;
    const totalPrice = seatPrice * seats.length;
    const items = seats.map((seat) => {
        return {
            name: `Seat(${seat.x},${seat.y})`,
            description: `Seat(${seat.x},${seat.y}) in ${match.name} match`,
            quantity: "1",
            unit_amount: {
                currency_code: "USD",
                value: seatPrice,
            },
        };
    });
    return {
        intent: "CAPTURE",
        application_context: {
            brand_name: "FifaX",
            locale: "en-US",
            landing_page: "BILLING",
            user_action: "CONTINUE",
        },
        purchase_units: [
            {
                amount: {
                    breakdown: {
                        item_total: {
                            currency_code: "USD",
                            value: totalPrice,
                        },
                    },
                    currency_code: "USD",
                    value: totalPrice,
                },
                description: `Seats for ${match.name} match`,
                items,
            },
        ],
    };
}

async function createReservationOrder(match, seats) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody(buildOrderBody(match, seats));

    const order = await paypalClient.execute(request);
    return order.result.id;
}

async function captureOrder(orderId) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const response = await paypalClient.execute(request);
    const captured= response.statusCode === 201;
    const captureId=!captured?undefined:response.result.purchase_units[0].payments.captures[0].id;
    return {
        captured,
        captureId
    };
}

async function refundOrder(captureId) {
    const request = new paypal.payments.CapturesRefundRequest(captureId);
    request.requestBody({});
    const response = await paypalClient.execute(request);
    return response;
}
module.exports = { createReservationOrder, captureOrder, refundOrder };
