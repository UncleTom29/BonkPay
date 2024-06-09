const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MerchantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  redirectUrl: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    required: true,
    unique: true
  },
  recipientPublicKey: {
    type: String,
    required: true,
    unique: true
  }
});

MerchantSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

MerchantSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Merchant', MerchantSchema);
