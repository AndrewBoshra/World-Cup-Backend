require('dotenv').config()

const { PORT, ENV, MONGO_USER,MONGO_PASSWORD,MONGO_URL, SALT, PEPPER, JWT_PASSWORD } =
	process.env;
    
module.exports = {
    MONGO_URL:MONGO_URL.replace("<username>",MONGO_USER).replace("<password>",MONGO_PASSWORD),
    PORT: PORT || 8000,
    ENV,
    IS_DEV:ENV==='Development',
    SALT,
    PEPPER,
    JWT_PASSWORD
};
