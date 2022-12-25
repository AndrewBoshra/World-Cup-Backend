const { createMatchViewModel } = require("./match");
const { createReservationViewModel } = require("./reservation");

function createOrderViewModel(order) {
  
    const { match, ticketNumber, orderId } = order;
    
    const matchVM = createMatchViewModel(order.match);
    
    const reservations = [];
    
    for(let seat of order.seats){
        const reservationVM = createReservationViewModel(match.getReservation(seat.x,seat.y))
        reservations.push(reservationVM);
    }
    
    return {
        match:matchVM,
        ticketNumber,
        orderId,
        reservations,
    };
}

module.exports = { createOrderViewModel };
