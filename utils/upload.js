const multer =require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
    destination: "./upload",
    filename: (req, file, cb) => {
        const type = file.mimetype.split("/")[1];
        return cb(null, `${uuidv4()}_${Date.now()}.${type}`);
    },
});

const upload = multer({
    storage: storage,
});

module.exports = upload ;
