const controller = require('../controllers/auth-controller');
const router = require('express').Router();

router.post('/signup', controller.register)
    .post('/login', controller.login);
module.exports = router;

