const express = require('express');
const { getBillers, payBill } = require('../controllers/billController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/billers', protect, getBillers);
router.post('/pay', protect, payBill);

module.exports = router;
