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

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, validate(productSchema), createProduct);
router.put('/:id', protect, validate(productSchema), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;