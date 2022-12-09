const router = require('express').Router();
const authRouter = require('./auth');
const dataRouter = require('./data');
const usersRouter = require('./user');

router.use('/auth',authRouter);
router.use('/data',dataRouter);
router.use('/users',usersRouter);

module.exports = router;

