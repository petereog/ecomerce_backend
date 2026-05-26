const router = require('express').Router();
const {
  createReview,
  getProductReviews,
  deleteReview,
} = require('../controllers/review.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;