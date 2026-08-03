const Transaction = require('../models/Transaction');

// @desc  Merchant dashboard stats: total received, today's total, recent payments
// @route GET /api/merchant/dashboard
const getMerchantDashboard = async (req, res) => {
  try {
    const merchantId = req.user._id;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalAgg, todayAgg, recent, count] = await Promise.all([
      Transaction.aggregate([
        { $match: { receiver: merchantId, type: 'merchant_payment', status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        {
          $match: {
            receiver: merchantId,
            type: 'merchant_payment',
            status: 'success',
            createdAt: { $gte: startOfToday },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.find({ receiver: merchantId, type: 'merchant_payment' })
        .populate('sender', 'name phone')
        .sort({ createdAt: -1 })
        .limit(10),
      Transaction.countDocuments({ receiver: merchantId, type: 'merchant_payment' }),
    ]);

    return res.json({
      totalReceived: totalAgg[0]?.total || 0,
      todayReceived: todayAgg[0]?.total || 0,
      totalPayments: count,
      recentPayments: recent,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getMerchantDashboard };
