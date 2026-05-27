const router = require('express').Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { validate, productSchema } = require('../middleware/validate.middleware');
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, upload.array('images', 5), createProduct);
router.put('/:id', protect, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;