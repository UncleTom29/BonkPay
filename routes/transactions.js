const express = require('express');
const { createTransaction, getTransactionStatus, getTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createTransaction);
router.get('/:id', protect, getTransactionStatus);
router.get('/', protect, getTransactions);

module.exports = router;
