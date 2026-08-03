const express = require('express');
const { lookupUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/lookup/:identifier', protect, lookupUser);

module.exports = router;
