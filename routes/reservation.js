const controller = require("../controllers/reservation-controller");
const authMiddleware = require("../middlewares/auth");
const router = require("express").Router({ mergeParams: true });

router
    .get("/status", controller.status)
    .use(authMiddleware.isAuthenticated(["Manager", "Fan"]))
    .get("/", controller.getAll)
    .post("/", controller.createReservationPayment)
    .post("/capture-payment", controller.captureReservation)
    .delete("/", controller.cancelReservation);
module.exports = router;
