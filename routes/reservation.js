const controller = require("../controllers/reservation-controller");
const authMiddleware = require("../middlewares/auth");
const router = require("express").Router({ mergeParams: true });

router
    .get("/status", controller.status)
    .get("/", controller.getAll)
    .use(authMiddleware.isAuthenticated(["Manager", "Fan"]))
    .post("/", controller.createReservationPayment)
    .post("/capture-payment", controller.captureReservation)
    .delete("/:orderId", controller.cancelReservation);
module.exports = router;
