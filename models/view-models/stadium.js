const config= require('../../config/index')

function createStadiumViewModel(data) {
    const { id, name, description, image, VIPlounge } = data;
    return {
        id,
        name,
        description,
        image:config.IMAGES_URL+"/"+image,
        VIPlounge,
    };
}

module.exports = { createStadiumViewModel };
