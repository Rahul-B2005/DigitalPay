const express = require('express');
const { sendMoney, payViaQr } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/transfer', protect, sendMoney);
router.post('/qr-pay', protect, payViaQr);

module.exports = router;
