const { createUserSimpleViewModel } = require("./user");

function createReservationViewModel(data) {
    if(!data){
        console.log("HHHHHHHHHHHERER")
        return
    }
    const user = createUserSimpleViewModel(data.user);
    const seat = {
        x: data.seat.x,
        y: data.seat.y,
    };
    const { id, ticketNumber } = data;
    return {
        id,
        user,
        seat,
        ticketNumber,
    };
}

module.exports = { createReservationViewModel };
