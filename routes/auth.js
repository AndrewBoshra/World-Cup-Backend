const controller = require('../controllers/auth-controller');
const router = require('express').Router();
const authMiddlewares =require("../middlewares/auth") 

router
    .post("/signup", controller.register)
    .post("/login", controller.login)
    .post("/reset-password", authMiddlewares.isAuthenticated(), controller.resetPassword);
module.exports = router;

