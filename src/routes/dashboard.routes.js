const router = require('express').Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', protect, adminOnly, getDashboardStats);

module.exports = router;