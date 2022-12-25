require('dotenv').config()

const {
    PORT,
    ENV,
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_URL,
    JWT_PASSWORD,
    ROOT_URL,
    IMAGE_UPLOADS,
    PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET,
} = process.env;
    
module.exports = {
    MONGO_URL: MONGO_URL.replace("<username>", MONGO_USER).replace(
        "<password>",
        MONGO_PASSWORD
    ),
    PORT: PORT || 8000,
    ENV,
    IS_DEV: ENV === "Development",
    JWT_PASSWORD,
    ROOT_URL,
    IMAGES_URL: ROOT_URL + IMAGE_UPLOADS,
    IMAGE_UPLOADS,
    PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET,
};
