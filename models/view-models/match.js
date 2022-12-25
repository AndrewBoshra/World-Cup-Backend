const { createTeamViewModel } = require("./team");
const { createStadiumViewModel } = require("./stadium");
const { createUserSimpleViewModel } = require("./user");

function createMatchViewModel(data) {
    const team1 = createTeamViewModel(data.team1);
    const team2 = createTeamViewModel(data.team2);
    const stadium = createStadiumViewModel(data.stadium);

    const { id, date, mainReferee, linesMan1, linesMan2, name, seatPrice } =
        data;
    return {
        id,
        date,
        mainReferee,
        linesMan1,
        linesMan2,
        team1,
        team2,
        stadium,
        name,
        seatPrice,
    };
}
function createReservationStatus(match) {
    const { width, height } = match.stadium.VIPlounge;

    const seats = [];
    let reservedSeats = 0;
    for (let y = 0; y < height; y++) {
        seats.push([]);
        for (let x = 0; x < width; x++) {
            const reservation = match.getReservation(x + 1, y + 1);
            const isSeatReserved = match.isSeatReserved(x + 1, y + 1);

            reservedSeats += isSeatReserved;

            const seatData = {
                isReserved: isSeatReserved,
                reservedTo: isSeatReserved
                    ? createUserSimpleViewModel(reservation.user)
                    : undefined,
            };
            seats[y].push(seatData);
        }
    }
    return {
        seats,
        reservedSeats,
        emptySeats: width * height - reservedSeats,
        reservedSeatsPercentage: (reservedSeats / (width * height)) * 100,
    };
}
module.exports = { createMatchViewModel, createReservationStatus };
