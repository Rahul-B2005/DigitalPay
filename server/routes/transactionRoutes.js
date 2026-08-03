const express = require('express');
const { getMyTransactions, getTransactionById } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getMyTransactions);
router.get('/:id', protect, getTransactionById);

module.exports = router;
