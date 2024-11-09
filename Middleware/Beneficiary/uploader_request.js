const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath;
        switch (file.fieldname) {
            // case 'profile_image':
            //     uploadPath = path.join(__dirname, '../../images/profileimages/beneficiary/');
            //     break;
            case 'image1':
            case 'image2':
            case 'image3':
                uploadPath = path.join(__dirname, '../../images/request_proof/');
                break;
            case 'certificate_image':
                uploadPath = path.join(__dirname, '../../images/request_certificate/');
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

const uploader_request = multer({ storage: storage });

module.exports = uploader_request;
