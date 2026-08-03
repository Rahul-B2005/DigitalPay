const mongoose = require('mongoose');

const billerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['mobile_recharge', 'electricity', 'dth', 'gas', 'water', 'broadband', 'fastag'],
      required: true,
    },
    icon: { type: String, default: '' }, // icon key used by frontend
    minAmount: { type: Number, default: 10 },
    maxAmount: { type: Number, default: 10000 },

    // Fixed-price plans (mobile/DTH/broadband packs, gas cylinder prices etc.)
    // Left empty ([]) for billers where the amount is variable, e.g. electricity/water.
    plans: [
      {
        price: { type: Number, required: true },
        validity: { type: String, default: '' }, // e.g. "28 days"
        data: { type: String, default: '' }, // e.g. "1.5GB/day"
        calls: { type: String, default: '' }, // e.g. "Unlimited"
        sms: { type: String, default: '' }, // e.g. "100/day"
        description: { type: String, default: '' }, // free-text tag, e.g. "Best value"
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Biller', billerSchema);
