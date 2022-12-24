const config = require("../../config/index");

function createTeamViewModel(data) {
    const {id, name, flag } = data;
    return {
        id,
        name,
        flag:  flag,
    };
}

module.exports = { createTeamViewModel };
