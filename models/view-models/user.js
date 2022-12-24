function createUserViewModel(data) {
    const {
        id,
        username,
        firstName,
        lastName,
        birthDate,
        gender,
        nationality,
        email,
        roles,
    } = data;
    return {
        id,
        username,
        firstName,
        lastName,
        birthDate,
        gender,
        nationality,
        email,
        roles,
    };
}

function createUserSimpleViewModel(data) {
    const { id, username, firstName, lastName } = data;
    return {
        id,
        username,
        firstName,
        lastName,
    };
}
module.exports = { createUserViewModel, createUserSimpleViewModel };
