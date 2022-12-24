const Team = require("../models/db_models/team");
const AppError = require("../models/app-error");
const AppResponse = require("../models/app-response");
const { createTeamViewModel } = require("../models/view-models/team");

async function get(req, res) {
    const { id } = req.params;
    const team = await Team.findById(id);

    if (!team) {
        throw new AppError("Team not found", 404);
    }

    const data = createTeamViewModel(team);
    new AppResponse(res, data, 200).send();
}

async function getAll(req, res) {
    const teams = await Team.find();
    const teamsVMS = teams.map((t) => createTeamViewModel(t));

    new AppResponse(res, teamsVMS, 200).send();
}
module.exports={get,getAll}