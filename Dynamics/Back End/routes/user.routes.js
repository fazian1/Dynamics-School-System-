let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    router = express.Router();

const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype ==  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        || file.mimetype ==  "application/zip" || file.mimetype == "application/msword" || file.mimetype ==  "application/x-zip" || file.mimetype == "application/vnd.ms-office"
        || file.mimetype ==  "apmlformats-officedocumplication/vnd.openxent.spreadsheetml.sheet" || file.mimetype == "application/vnd.ms-excel" || file.mimetype == "application/octet-stream"
        || file.mimetype == "application/msword" || file.mimetype == "application/excel" || file.mimetype == "text/plain" || file.mimetype == "text/plain" || file.mimetype == "application/pdf"
        || file.mimetype == "application/force-download" || file.mimetype == "application/x-download" || file.mimetype == "binary/octet-stream" || file.mimetype == "video/mp4"
        || file.mimetype == "audio/mpeg" || file.mimetype == "video/webm" || file.mimetype == "audio/webm" ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed! Not working'));
        }
    }
});

// User model
let User = require('../models/FileUpload');

router.post('/user-profile', upload.single('profileImg'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        profileImg: url + '/public/' + req.file.filename
    });
    user.save().then(result => {
        res.status(201).json({
            message: "User registered successfully!",
            userCreated: {
                _id: result._id,
                profileImg: result.profileImg
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})

router.get("/", (req, res, next) => {
    User.find().then(data => {
        res.status(200).json({
            message: "User list retrieved successfully!",
            users: data
        });
    });
});

module.exports = router;