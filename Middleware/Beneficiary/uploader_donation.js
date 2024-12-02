const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath;
        console.log("lud")
        switch (file.fieldname) {
            case 'usage_image1':
            case 'usage_image2':
            case 'usage_image3':
            case 'usage_image4':
            case 'usage_image5':
                uploadPath = path.join(__dirname, '../../images/donation_use/');
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
