function createUserViewModel(data){
    const {username,firstName,lastName,birthDate,gender,nationality,email,roles} = data;
    return {username,firstName,lastName,birthDate,gender,nationality,email,roles};
}


module.exports = {createUserViewModel};