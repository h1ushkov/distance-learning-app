// routes/testAttemptRoutes.js
const express = require('express');
const router = express.Router();
const { startTest, submitTest } = require('../controllers/testAttemptController');
const { protect } = require('../middleware/authMiddleware'); // Assume you have an authentication middleware

router.post('/start/:testId', protect, startTest);
router.post('/submit/:attemptId', protect, submitTest);

module.exports = router;
