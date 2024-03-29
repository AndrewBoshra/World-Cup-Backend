const controller = require("../controllers/match-controller");
const authMiddleware = require("../middlewares/auth");
const router = require("express").Router();
const reservationRouter = require("./reservation");

router
    .use("/:matchId/reservations",reservationRouter)
    .get("/:id", controller.get)
    .get("/", controller.getAll)
    .use(authMiddleware.isAuthenticated(["Manager"]))
    .post("/",  controller.create)
    .patch("/:id", controller.update)
    .delete("/:id", controller.deleteMatch);
module.exports = router;
