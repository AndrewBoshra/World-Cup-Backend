const controller = require("../controllers/team-controller");
const router = require("express").Router();

router
    .get("/:id", controller.get)
    .get("/", controller.getAll);
module.exports = router;
