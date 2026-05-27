const router = require('express').Router();
const {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
} = require('../controllers/auth.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { validate, registerSchema, loginSchema } = require('../middleware/validate.middleware');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;