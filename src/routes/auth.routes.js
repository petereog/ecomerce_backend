const router = require('express').Router();
const { register, login, logout, refreshToken } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate, registerSchema, loginSchema } = require('../middleware/validate.middleware');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);

module.exports = router;