require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'ecommerce',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      timestamp: Math.round(Date.now() / 1000),
    };
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };