const User = require('../models/User');
const Transaction = require('../models/Transaction');

const verifyPin = async (user, pin) => {
  if (!user.walletPin) return { ok: false, message: 'Please set your wallet PIN first' };
  const match = await user.matchPin(pin);
  if (!match) return { ok: false, message: 'Incorrect wallet PIN' };
  return { ok: true };
};

// @desc  Send money to another user via phone/email
// @route POST /api/payments/transfer
const sendMoney = async (req, res) => {
  try {
    const { recipient, amount, pin, note } = req.body;
    const amt = Number(amount);

    if (!recipient || !amt || amt <= 0) {
      return res.status(400).json({ message: 'Recipient and valid amount are required' });
    }

    const sender = await User.findById(req.user._id);
    const pinCheck = await verifyPin(sender, pin);
    if (!pinCheck.ok) return res.status(400).json({ message: pinCheck.message });

    if (sender.walletBalance < amt) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    const receiver = await User.findOne({ $or: [{ email: recipient }, { phone: recipient }] });
    if (!receiver) return res.status(404).json({ message: 'Recipient not found' });
    if (receiver._id.equals(sender._id)) {
      return res.status(400).json({ message: 'Cannot send money to yourself' });
    }

    sender.walletBalance -= amt;
    receiver.walletBalance += amt;
    await sender.save();
    await receiver.save();

    const txn = await Transaction.create({
      sender: sender._id,
      receiver: receiver._id,
      type: 'p2p_transfer',
      amount: amt,
      note: note || '',
      description: `Paid to ${receiver.name}`,
      senderBalanceAfter: sender.walletBalance,
      receiverBalanceAfter: receiver.walletBalance,
    });

    return res.status(201).json({ walletBalance: sender.walletBalance, transaction: txn });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc  Pay via scanned QR code (user or merchant)
// @route POST /api/payments/qr-pay
const payViaQr = async (req, res) => {
  try {
    const { qrCodeId, amount, pin, note } = req.body;
    const amt = Number(amount);

    if (!qrCodeId || !amt || amt <= 0) {
      return res.status(400).json({ message: 'QR code and valid amount are required' });
    }

    const sender = await User.findById(req.user._id);
    const pinCheck = await verifyPin(sender, pin);
    if (!pinCheck.ok) return res.status(400).json({ message: pinCheck.message });

    if (sender.walletBalance < amt) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    const receiver = await User.findOne({ qrCodeId });
    if (!receiver) return res.status(404).json({ message: 'Invalid or unknown QR code' });
    if (receiver._id.equals(sender._id)) {
      return res.status(400).json({ message: 'Cannot pay yourself' });
    }

    sender.walletBalance -= amt;
    receiver.walletBalance += amt;
    await sender.save();
    await receiver.save();

    const isMerchant = receiver.role === 'merchant';

    const txn = await Transaction.create({
      sender: sender._id,
      receiver: receiver._id,
      type: isMerchant ? 'merchant_payment' : 'qr_payment',
      amount: amt,
      note: note || '',
      description: isMerchant
        ? `Paid to ${receiver.businessName || receiver.name}`
        : `Paid to ${receiver.name} via QR`,
      senderBalanceAfter: sender.walletBalance,
      receiverBalanceAfter: receiver.walletBalance,
    });

    return res.status(201).json({ walletBalance: sender.walletBalance, transaction: txn });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { sendMoney, payViaQr };
