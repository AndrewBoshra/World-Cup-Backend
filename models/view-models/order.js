const { createMatchViewModel } = require("./match");

function createOrderViewModel(data) {
    const match = createMatchViewModel(data.match);
    
    const { id, ticketNumber } = data;
    return {
        id,
        user,
        seat,
        ticketNumber,
    };
}

module.exports = { createReservationViewModel };
