const paypal = require("@paypal/checkout-server-sdk");
const  config  = require("../config/index");

let paypalClient = new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(
        config.PAYPAL_CLIENT_ID,
        config.PAYPAL_CLIENT_SECRET
    )
);



async function createReservationOrder({ amount, name }) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: amount,
                    breakdown: {
                        item_total: {
                            currency_code: "USD",
                            value: amount,
                        },
                    },
                },
                items: [
                    {
                        name,
                        unit_amount: {
                            currency_code: "USD",
                            value: amount,
                        },
                        quantity: 1,
                    },
                ],
            },
        ],
    });


    const order = await paypalClient.execute(request)
    return order.result.id;
}


async function isOrderCapture(orderId) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const response = await paypalClient.execute(request);
    return response.statusCode == 201;
}
module.exports = { createReservationOrder, isOrderCapture };