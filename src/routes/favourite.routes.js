const router = require('express').Router();
const {
  getFavourites,
  addToFavourites,
  removeFromFavourites,
} = require('../controllers/favourite.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getFavourites);
router.post('/', addToFavourites);
router.delete('/:productId', removeFromFavourites);

module.exports = router;