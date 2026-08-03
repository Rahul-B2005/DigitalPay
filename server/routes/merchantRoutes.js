const express = require('express');
const { getMerchantDashboard } = require('../controllers/merchantController');
const { protect, merchantOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, merchantOnly, getMerchantDashboard);

module.exports = router;
