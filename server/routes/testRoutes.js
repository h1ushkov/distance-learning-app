// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.post('/', testController.createTest);
router.get('/l/:lessonId', testController.getTestsByLesson);
router.get('/:id', testController.getTest);
router.put('/:id', testController.updateTest);
router.delete('/:id', testController.deleteTest);

module.exports = router;
