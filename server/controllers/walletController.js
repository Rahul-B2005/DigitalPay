const QRCode = require('qrcode');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc  Get wallet balance
// @route GET /api/wallet/balance
const getBalance = async (req, res) => {
  return res.json({ walletBalance: req.user.walletBalance });
};

// @desc  Add money to wallet (simulated bank top-up)
// @route POST /api/wallet/add-money
const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      return res.status(400).json({ message: 'Enter a valid amount' });
    }
    if (amt > 100000) {
      return res.status(400).json({ message: 'Max ₹1,00,000 per top-up' });
    }

    const user = await User.findById(req.user._id);
    user.walletBalance += amt;
    await user.save();

    const txn = await Transaction.create({
      receiver: user._id,
      type: 'add_money',
      amount: amt,
      description: 'Added money via bank/card',
      receiverBalanceAfter: user.walletBalance,
    });

    return res.status(201).json({ walletBalance: user.walletBalance, transaction: txn });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc  Generate personal QR code (encodes qrCodeId)
// @route GET /api/wallet/my-qr
const getMyQrCode = async (req, res) => {
  try {
    const payload = JSON.stringify({ qrCodeId: req.user.qrCodeId, type: 'user_pay' });
    const dataUrl = await QRCode.toDataURL(payload);
    return res.json({ qrDataUrl: dataUrl, qrCodeId: req.user.qrCodeId });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getBalance, addMoney, getMyQrCode };
