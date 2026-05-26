const router = require('express').Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { validate, orderSchema } = require('../middleware/validate.middleware');

router.use(protect);

router.post('/', validate(orderSchema), createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/status', adminOnly, updateOrderStatus);
router.get('/', adminOnly, getAllOrders);

module.exports = router;