const router = require('express').Router();
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/clear', clearCart);
router.delete('/:productId', removeFromCart);

module.exports = router;