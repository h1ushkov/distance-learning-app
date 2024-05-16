const express = require('express');
const router = express.Router();
const fileController = require('../controllers/uploadController');

router.get('/', fileController.getAllFiles);
router.get('/:id', fileController.getFileById);
router.get('/lesson/:lessonId', fileController.getFilesByLessonId);
router.get('/user/:userId', fileController.getFilesByUserId);
router.delete('/:id', fileController.deleteFile);
router.put('/:id', fileController.updateFile);

module.exports = router;
