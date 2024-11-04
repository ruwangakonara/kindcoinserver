const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath;
        switch (file.fieldname) {
            case 'image1':
            case 'image2':
            case 'image3':
            case 'image4':
                uploadPath = path.join(__dirname, '../../images/donation_proof/');
                break;
            default:
                uploadPath = path.join(__dirname, '../../images/others/');
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploader = multer({ storage: storage });

module.exports = uploader;
