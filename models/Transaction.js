const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amountUSD: {
    type: Number,
    required: true
  },
  amountBonk: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  redirectUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
