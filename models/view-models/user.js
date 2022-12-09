function createUserViewModel(data){
    const {id,username,firstName,lastName,birthDate,gender,nationality,email,roles} = data;
    return {id,username,firstName,lastName,birthDate,gender,nationality,email,roles};
}


module.exports = {createUserViewModel};