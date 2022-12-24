const mongoose = require("mongoose");
const uuid = require("uuid");

const AppError = require("../app-error");
const Schema = mongoose.Schema;

const Team = require("./team");
const Stadium = require("./stadium");
const { dateDiffInDays } = require("../../utils");

const reservation = {
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: "{PATH} is required!",
        autopopulate: true,
    },
    seat: {
        x: {
            type: Number,
            validate: validateSeatX,
        },
        y: {
            type: Number,
            validate: validateSeatY,
        },
    },
    ticketNumber: {
        type: String,
        immutable: true,
        default: uuid.v4,
    },
};

async function validateSeatX(x) {
    if (x < 1) throw new AppError("x cannot be less than 1");
    const { stadium } = this.parent();
    const { width } = stadium.VIPlounge;
    if (x > width)
        throw new AppError(
            `x cannot be greater than stadium width ${width}`,
            400
        );
}
async function validateSeatY(y) {
    if (y < 1) throw new AppError("y cannot be less than 1");
    const { stadium } = this.parent();
    const { height } = stadium.VIPlounge;
    if (y > height)
        throw new AppError(
            `y cannot be greater than stadium height ${height}`,
            400
        );
}
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
    reservations: {
        type: [reservation],
        default: [],
    },
});

async function getMatchesForTeam(team_id, date) {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    const next_day = new Date(day);
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
    return (
        teamMatches.length === 0 ||
        (teamMatches.length === 1 && teamMatches[0]._id.equals(this.id))
    );
}

matchSchema.pre("validate", function (next) {
    if (this.team1.equals(this.team2)) {
        throw new AppError("Team Can't Play against itself", 400);
    }
    next();
});

matchSchema.pre("validate", async function (next) {
    const team1 = await Team.findById(this.team1);
    const team2 = await Team.findById(this.team2);

    if (!team1) {
        throw new AppError(`team ${this.team1} doesn't exist`, 400);
    }
    if (!team2) {
        throw new AppError(`team ${this.team2} doesn't exist`, 400);
    }
    this.team1 = team1;
    this.team2 = team2;

    next();
});
matchSchema.pre("validate", async function (next) {
    const stadium = await Stadium.findById(this.stadium);

    if (!stadium) {
        throw new AppError(`stadium ${this.stadium} doesn't exist`, 400);
    }

    this.stadium = stadium;
    next();
});
matchSchema.plugin(require("mongoose-autopopulate"));

const Match = mongoose.model("Match", matchSchema);

Match.prototype.getReservation = function (x, y) {
    const { reservations } = this;
    return reservations.find((r) => r.seat.x == x && r.seat.y == y);
};

Match.prototype.isSeatReserved = function (x, y) {
    return this.getReservation(x,y)!== undefined;
};

Match.prototype.getUserReservation = function (user) {
    const { reservations } = this;
    return reservations.find((s) => s.user._id.equals(user));
};


Match.prototype.reserve = function (user, x, y) {
    if (this.getUserReservation(user)) {
        throw new AppError(`This User already has a reservation`, 400);
    }

    if (this.isSeatReserved(x, y)) {
        throw new AppError(`Seat (${x},${y}) is already reserved`, 400);
    }
    if (this.date < new Date()) {
        throw new AppError(`This match already played`, 400);
    }

    this.reservations.push({
        seat: { x, y },
        user,
    });
};

Match.prototype.cancelReservation = function (user) {
    
    const reservation=this.getUserReservation(user);
    
    if (reservation == undefined) {
        throw new AppError(`You don't have a reservation`, 400);
    }
    if (dateDiffInDays(new Date(),this.date) <= 3) {
        throw new AppError(`You can't cancel this reservation now`, 400);
    }
    
    this.reservations = this.reservations.filter(r=> r !== reservation);

};
module.exports = Match;
