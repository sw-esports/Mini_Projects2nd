const multer = require("multer");
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/images'); // Adjusted destination path
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, name) {
            const filename = name.toString('hex') + path.extname(file.originalname);
            cb(null, filename);
        });
    }
});

const upload = multer({ storage: storage });
module.exports = upload;
