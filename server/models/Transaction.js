const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const transactionSchema = new mongoose.Schema(
  {
    referenceId: { type: String, default: () => `TXN${uuidv4().split('-')[0].toUpperCase()}` },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    type: {
      type: String,
      enum: ['add_money', 'p2p_transfer', 'qr_payment', 'merchant_payment', 'bill_payment', 'withdraw'],
      required: true,
    },
    amount: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'success' },

    // Bill-payment specific
    billerName: { type: String, default: null },
    billCategory: { type: String, default: null },
    consumerNumber: { type: String, default: null },

    description: { type: String, default: '' },
    note: { type: String, default: '' },

    senderBalanceAfter: { type: Number, default: null },
    receiverBalanceAfter: { type: Number, default: null },
  },
  { timestamps: true }
);

transactionSchema.index({ sender: 1, createdAt: -1 });
transactionSchema.index({ receiver: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
