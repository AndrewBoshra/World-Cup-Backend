const mongoose = require("mongoose");
const AppError = require("../app-error");
const Schema = mongoose.Schema;

const Team = require("./team");
const Stadium = require("./stadium");
const matchSchema = new Schema({
    team1: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: "{PATH} is required!",
        autopopulate: true,
        validate: {
            validator: checkIfTeamAlreadyHasMatch,
            message: (props) => `${props.value} already has a match that day!`,
        },
    },
    team2: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: "{PATH} is required!",
        autopopulate: true,
        validate: {
            validator: checkIfTeamAlreadyHasMatch,
            message: (props) => `${props.value} already has a match that day!`,
        },
    },
    stadium: {
        type: Schema.Types.ObjectId,
        ref: "Stadium",
        required: "{PATH} is required!",
        autopopulate: true,
    },
    date: {
        type: Date,
        required: "{PATH} is required!",
    },
    mainReferee: {
        type: String,
        required: "{PATH} is required!",
    },
    linesMan1: {
        type: String,
        required: "{PATH} is required!",
        minLength: [3, "{PATH} can't be less than 3 chars"],
        trim: true,
    },
    linesMan2: {
        type: String,
        required: "{PATH} is required!",
        minLength: [3, "{PATH} can't be less than 3 chars"],
        trim: true,
    },
});

async function getMatchesForTeam(team_id, day) {
    const next_day = new Date();
    next_day.setDate(day.getDate() + 1);

    return Match.find({
        $and: [
            {
                $or: [{ team1: team_id }, { team2: team_id }],
            },
            {
                date: {
                    $gte: day,
                    $lt: next_day,
                },
            },
        ],
    });
}

async function checkIfTeamAlreadyHasMatch(id) {
    teamMatches = await getMatchesForTeam(id, this.date);
    return teamMatches.length === 0;
}

matchSchema.pre('validate',function (next){
    if(this.team1.equals(this.team2)){
        throw new AppError("Team Can't Play against itself",400);
    }
    next();
});

matchSchema.pre("validate", async function (next) {
    const team1 = await Team.findById(this.team1);
    const team2 = await Team.findById(this.team2);

    if (!team1)
    {
        throw new AppError(`team ${this.team1} doesn't exist`,400);
    }
    if (!team2) {
        throw new AppError(`team ${this.team2} doesn't exist`,400);
    }
    this.team1 = team1;
    this.team2 = team2;

    next();
});
matchSchema.pre("validate", async function (next) {
    const stadium = await Stadium.findById(this.stadium);

    if (!stadium) {
        throw new AppError(`stadium ${this.stadium} doesn't exist`,400);
    }
    
    this.stadium = stadium;
    next();
});
matchSchema.plugin(require("mongoose-autopopulate"));

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
