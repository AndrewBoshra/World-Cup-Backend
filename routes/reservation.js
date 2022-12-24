const controller = require("../controllers/reservation-controller");
const authMiddleware = require("../middlewares/auth");
const router = require("express").Router({mergeParams:true});

router
    .get("/:id", controller.get)
    .get("/", controller.getAll)
    .use(authMiddleware.isAuthenticated(["Manager"]))
    .post("/", controller.create)
    .patch("/:id", controller.update)
    .delete("/:id", controller.deleteMatch);
module.exports = router;
