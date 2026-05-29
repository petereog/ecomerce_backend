const OTP = require('../models/OTP');
const User = require('../models/User');
const { sendOTP } = require('../config/mailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
};

// SEND OTP
exports.sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      const err = new Error('Email is required');
      err.statusCode = 400;
      return next(err);
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.deleteMany({ email });
    await OTP.create({ email, otp, expiresAt });
    await sendOTP(email, otp);

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    next(err);
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, username } = req.body;

    if (!email || !otp) {
      const err = new Error('Email and OTP are required');
      err.statusCode = 400;
      return next(err);
    }

    const otpRecord = await OTP.findOne({ email, isUsed: false });

    if (!otpRecord) {
      const err = new Error('OTP not found. Please request a new one');
      err.statusCode = 400;
      return next(err);
    }

    if (otpRecord.expiresAt < new Date()) {
      const err = new Error('OTP has expired. Please request a new one');
      err.statusCode = 400;
      return next(err);
    }

    if (otpRecord.otp !== otp) {
      const err = new Error('Invalid OTP');
      err.statusCode = 400;
      return next(err);
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    let user = await User.findOne({ email });
    if (!user) {
      const hashed = await bcrypt.hash(Math.random().toString(36), 12);
      user = await User.create({
        username: username || email.split('@')[0],
        email,
        password: hashed,
      });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};