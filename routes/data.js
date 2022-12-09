const controller = require("../controllers/data-controller");
const router = require("express").Router();

router.get("/nationalities", controller.getNationalities);
module.exports = router;
