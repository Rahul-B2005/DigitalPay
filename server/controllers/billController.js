const User = require('../models/User');
const Biller = require('../models/Biller');
const Transaction = require('../models/Transaction');

// @desc  List billers, optionally filtered by category
// @route GET /api/bills/billers?category=mobile_recharge
const getBillers = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const billers = await Biller.find(filter).sort({ name: 1 });
    return res.json({ billers });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc  Pay a bill / recharge
// @route POST /api/bills/pay
const payBill = async (req, res) => {
  try {
    const { billerId, consumerNumber, amount, pin } = req.body;
    const amt = Number(amount);

    if (!billerId || !consumerNumber || !amt || amt <= 0) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const biller = await Biller.findById(billerId);
    if (!biller) return res.status(404).json({ message: 'Biller not found' });

    if (amt < biller.minAmount || amt > biller.maxAmount) {
      return res.status(400).json({
        message: `Amount must be between ₹${biller.minAmount} and ₹${biller.maxAmount}`,
      });
    }

    const user = await User.findById(req.user._id);
    if (!user.walletPin) return res.status(400).json({ message: 'Please set your wallet PIN first' });
    const pinOk = await user.matchPin(pin);
    if (!pinOk) return res.status(400).json({ message: 'Incorrect wallet PIN' });

    if (user.walletBalance < amt) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    user.walletBalance -= amt;
    await user.save();

    const txn = await Transaction.create({
      sender: user._id,
      type: 'bill_payment',
      amount: amt,
      billerName: biller.name,
      billCategory: biller.category,
      consumerNumber,
      description: `${biller.name} bill payment`,
      senderBalanceAfter: user.walletBalance,
    });

    return res.status(201).json({ walletBalance: user.walletBalance, transaction: txn });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getBillers, payBill };
