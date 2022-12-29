const Team = require("./models/db_models/team");
const Stadium = require("./models/db_models/stadium");
const teamsRaw = require("./data-seed.json").Team;
const stadiumsRaw = require("./data-seed.json").Stadiums;


async function seedTeams() {
    const teams=await Team.find();
    if(teams.length)
        return
    
    for(let i=0;i< teamsRaw.imgs.length;i++){
        await new Team({ name: teamsRaw.names[i], flag: teamsRaw.imgs[i] }).save();
    }
}

async function seedStadiums() {
    const stadiums=await Stadium.find();
    if (stadiums.length) return;
    
    for(let s of stadiumsRaw){
        await new Stadium(s).save();
    }
}

async function seed(){
    await seedTeams();
    await seedStadiums();
}
module.exports= {seed}