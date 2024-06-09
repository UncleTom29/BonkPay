const Merchant = require('../models/Merchant');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.register = async (req, res) => {
  const { name, email, password, redirectUrl, recipientPublicKey } = req.body;

  try {
    const existingMerchant = await Merchant.findOne({ email });
    if (existingMerchant) {
      return res.status(400).json({ message: 'Merchant already exists' });
    }
    const apiKey = crypto.randomBytes(16).toString('hex');

    const merchant = await Merchant.create({ name, email, password, redirectUrl, apiKey, recipientPublicKey });

    const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(201).json({ token, apiKey });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const merchant = await Merchant.findOne({ email });
    if (!merchant || !(await merchant.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({ token, apiKey: merchant.apiKey });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
