const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user-uploads',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ 
    storage: storage, 
 });

module.exports = upload;