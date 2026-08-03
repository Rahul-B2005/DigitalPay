const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    walletPin: { type: String, default: null }, // hashed 4-digit PIN, set after first login
    walletBalance: { type: Number, default: 0, min: 0 },
    role: { type: String, enum: ['user', 'merchant', 'admin'], default: 'user' },

    // Merchant-only fields
    businessName: { type: String, default: null },
    businessCategory: {
      type: String,
      enum: ['retail', 'grocery', 'food', 'fashion', 'electronics', 'services', 'other', null],
      default: null,
    },

    qrCodeId: { type: String, default: () => uuidv4(), unique: true },
    kycVerified: { type: Boolean, default: false },
    avatarColor: {
      type: String,
      default: () => ['#00baf2', '#002970', '#1cb35e', '#ff6f00', '#8e44ad'][Math.floor(Math.random() * 5)],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('walletPin') && this.walletPin) {
    this.walletPin = await bcrypt.hash(this.walletPin, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.matchPin = async function (entered) {
  if (!this.walletPin) return false;
  return bcrypt.compare(entered, this.walletPin);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.walletPin;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
