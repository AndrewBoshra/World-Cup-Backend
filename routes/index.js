const router = require('express').Router();
const authRouter = require('./auth');
const dataRouter = require('./data');
const usersRouter = require('./user');
const stadiumsRouter = require("./stadium");
const matchesRouter = require("./match");
const teamsRouter = require("./team");
const config= require('../config/index')
const path =require('path');
const express =require('express');

router.use('/auth',authRouter);
router.use('/data',dataRouter);
router.use('/users',usersRouter);
router.use("/stadiums", stadiumsRouter);
router.use("/matches", matchesRouter);
router.use("/teams", teamsRouter);

router.use(`/${config.IMAGE_UPLOADS}`, express.static(path.join(__dirname,"../","upload")));


module.exports = router;

