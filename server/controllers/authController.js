const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc  Register new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, businessName, businessCategory } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ message: 'Account with this email or phone already exists' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role === 'merchant' ? 'merchant' : 'user',
      businessName: role === 'merchant' ? businessName : null,
      businessCategory: role === 'merchant' ? businessCategory : null,
      walletBalance: 500, // welcome bonus for demo purposes
    });

    return res.status(201).json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc  Login
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc  Set or update wallet PIN
// @route POST /api/auth/set-pin
const setWalletPin = async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: 'PIN must be exactly 4 digits' });
    }
    const user = await User.findById(req.user._id);
    user.walletPin = pin;
    await user.save();
    return res.json({ message: 'Wallet PIN set successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc  Get current logged-in user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  return res.json({ user: req.user });
};

module.exports = { registerUser, loginUser, setWalletPin, getMe };
