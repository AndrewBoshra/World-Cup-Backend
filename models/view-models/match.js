const { createTeamViewModel } = require("./team");
const { createStadiumViewModel } = require("./stadium");

function createMatchViewModel(data) {
    const team1 = createTeamViewModel(data.team1);
    const team2 = createTeamViewModel(data.team2);
    const stadium = createStadiumViewModel(data.stadium);
    
    const { id, date, mainReferee, linesMan1, linesMan2 } = data;
    return {
        id,
        date,
        mainReferee,
        linesMan1,
        linesMan2,
        team1,
        team2,
        stadium,
    };
}

module.exports = { createMatchViewModel };
