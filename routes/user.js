const controller = require("../controllers/user-controller");
const authMiddleware = require("../middlewares/auth");
const router = require("express").Router();

router
    .get("/", authMiddleware.isAuthenticated(["Admin"]), controller.getAll)
    .patch(
        "/:id",
        authMiddleware.isAuthenticated(["Admin"]),
        controller.updateRole
    )
    .delete(
        "/:id",
        authMiddleware.isAuthenticated(["Admin"]),
        controller.deleteUser
    )

    .get("/profile", authMiddleware.isAuthenticated(), controller.get)
    .patch("/", authMiddleware.isAuthenticated(), controller.selfUpdate);

module.exports = router;
