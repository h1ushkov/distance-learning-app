const express = require("express");
const lessonController = require('../controllers/lessonController');
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const multer = require('multer');

router.use(validateToken);

router.get('/', lessonController.getAllLessons);

router.get('/cid/:courseId', lessonController.getAllLessonsFromCourse);

// Маршрут для получения информации о конкретном курсе
router.get('/:id', lessonController.getLessonById);

// Маршрут для создания нового курса
router.post('/cid/:courseId', lessonController.createLesson);
router.post('/materials/lid/:lessonId', lessonController.addMaterial);
router.delete('/materials/:lessonId/:materialId', lessonController.deleteMaterial); // Route to delete material
// Маршрут для обновления информации о курсе
router.put('/:id', lessonController.updateLesson);

router.post('/user/:userId/lesson/:lessonId/grade/:grade', lessonController.updateGrade);

// Маршрут для удаления курса
router.delete('/l/:id/c/:courseId', lessonController.deleteLesson);

module.exports = router;