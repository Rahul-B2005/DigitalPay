const express = require('express');
const { getBalance, addMoney, getMyQrCode } = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/balance', protect, getBalance);
router.post('/add-money', protect, addMoney);
router.get('/my-qr', protect, getMyQrCode);

module.exports = router;
