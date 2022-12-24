const config = require("../../config/index");

function createTeamViewModel(data) {
    const {id, name, flag } = data;
    return {
        id,
        name,
        flag: config.IMAGES_URL + "/" + flag,
    };
}

module.exports = { createTeamViewModel };
