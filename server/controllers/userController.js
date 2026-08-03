const User = require('../models/User');

// @desc  Look up a user by phone/email before sending money (shows name for confirmation)
// @route GET /api/users/lookup/:identifier
const lookupUser = async (req, res) => {
  try {
    const { identifier } = req.params;
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] }).select(
      'name phone email role businessName avatarColor'
    );
    if (!user) return res.status(404).json({ message: 'No user found' });
    if (user._id.equals(req.user._id)) return res.status(400).json({ message: 'That is your own account' });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { lookupUser };
