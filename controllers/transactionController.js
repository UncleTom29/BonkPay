const Transaction = require('../models/Transaction');
const Merchant = require('../models/Merchant');
const solanaService = require('../services/solanaService');
const axios = require('axios');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const getBonkPrice = async () => {
  const response = await axios.get(process.env.COINGECKO_API);
  return response.data.bonk.usd;
};

const sendEmail = (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const sendInvoiceEmail = (customerEmail, transaction) => {
  const templateSource = fs.readFileSync(path.join(__dirname, '../templates/invoice.hbs'), 'utf8');
  const template = handlebars.compile(templateSource);
  const html = template({ transaction });
  sendEmail(customerEmail, 'Your Invoice', html);
};

const sendPaymentAlertEmail = (merchantEmail, transaction) => {
  const templateSource = fs.readFileSync(path.join(__dirname, '../templates/paymentAlert.hbs'), 'utf8');
  const template = handlebars.compile(templateSource);
  const html = template({ transaction });
  sendEmail(merchantEmail, 'Payment Alert', html);
};

exports.createTransaction = async (req, res) => {
  const { amountUSD, redirectUrl } = req.body;
  const merchant = req.merchant;

  try {
    const bonkPrice = await getBonkPrice();
    const amountBonk = amountUSD / bonkPrice;

    const transaction = await Transaction.create({
      user: req.user._id,
      amountUSD,
      amountBonk,
      status: 'pending',
      redirectUrl,
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTransactionStatus = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.completeTransaction = async (req, res) => {
  const { status, signature } = req.body;

  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (status === 'completed') {
      const merchant = await Merchant.findById(transaction.merchant);
      const recipientPublicKey = new PublicKey(merchant.recipientPublicKey);
      const payerPublicKey = new PublicKey(req.user.publicKey); // Assuming user's publicKey is stored in user model
      const amountBonk = transaction.amountBonk;

      const signature = await solanaService.createBonkTransaction(payerPublicKey, recipientPublicKey, amountBonk);
      
      transaction.status = 'completed';
      transaction.signature = signature;
      await transaction.save();

      sendInvoiceEmail(transaction.user.email, transaction);
      sendPaymentAlertEmail(transaction.merchant.email, transaction);
    } else {
      transaction.status = status;
      transaction.signature = signature;
      await transaction.save();
    }

    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
