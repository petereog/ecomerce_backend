const router = require('express').Router();
const { getAllUsers } = require('../controllers/auth.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', protect, adminOnly, getAllUsers);

module.exports = router;