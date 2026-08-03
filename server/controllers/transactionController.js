const Transaction = require('../models/Transaction');

// @desc  Get logged-in user's transaction history (as sender or receiver)
// @route GET /api/transactions
const getMyTransactions = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const filter = { $or: [{ sender: req.user._id }, { receiver: req.user._id }] };
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter)
      .populate('sender', 'name phone email businessName')
      .populate('receiver', 'name phone email businessName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);

    return res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc  Get a single transaction by id (receipt view)
// @route GET /api/transactions/:id
const getTransactionById = async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id)
      .populate('sender', 'name phone email businessName')
      .populate('receiver', 'name phone email businessName');

    if (!txn) return res.status(404).json({ message: 'Transaction not found' });

    const isParty =
      (txn.sender && txn.sender._id.equals(req.user._id)) ||
      (txn.receiver && txn.receiver._id.equals(req.user._id));
    if (!isParty) return res.status(403).json({ message: 'Not authorized to view this transaction' });

    return res.json({ transaction: txn });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyTransactions, getTransactionById };
