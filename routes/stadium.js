const controller = require("../controllers/stadium-controller");
const authMiddleware = require("../middlewares/auth");
const router = require("express").Router();
const upload = require("../utils/upload");

router
    .get("/:id", controller.get)
    .get("/", controller.getAll)
    .use(authMiddleware.isAuthenticated(["Manager"]))
    .post("/", upload.single("image"), controller.create)
    .patch("/:id",upload.single("image"), controller.update)
    .delete("/:id", controller.deleteStadium);
module.exports = router;
