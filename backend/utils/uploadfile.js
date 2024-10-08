const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config();

const cloud_name = process.env.CLOUD_NAME || '';
const api_key = process.env.CLOUDINARY_API_KEY || '';
const api_secret = process.env.CLOUDINARY_API_SECRET || '';

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //first argument is reffering to error.null means no error
    //second argument is referring to the folder where it is stored(relative path)
      cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
      //first argument is reffering to error.null means no error
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //first indicates no error
  //second indicates file should be accepted
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
  } else {
      cb({ message: 'Unsupported File Format' }, false);
  }
};

const upload = multer({
  storage: storage,
  //1 MB
  limits: { fileSize: 1024 * 1024},
  fileFilter: fileFilter
});

const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file, {
          resource_type: "auto",
          folder: folder
      }, (error, result) => {
          if (error) {
              reject(error);
          } else {
              resolve({
                  url: result.url,
                  id: result.public_id
              });
          }
      });
  });
};
module.exports = { upload, uploadToCloudinary };
