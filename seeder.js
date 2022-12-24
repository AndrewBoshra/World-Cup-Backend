const Team = require("./models/db_models/team");
const teamsRaw = require("./data-seed.json").Team;


async function seedTeams() {
    const teams=await Team.find();
    if(teams.length)
        return
    
    for(let i=0;i< teamsRaw.imgs.length;i++){
        await new Team({ name: teamsRaw.names[i], flag: teamsRaw.imgs[i] }).save();
    }
}


module.exports= {seedTeams}