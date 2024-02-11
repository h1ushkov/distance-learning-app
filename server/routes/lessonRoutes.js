const express = require("express");
const lessonController = require('../controllers/lessonController');
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.use(validateToken);

router.get('/', lessonController.getAllLessons);

router.get('/cid/:courseId', lessonController.getAllLessonsFromCourse);

// Маршрут для получения информации о конкретном курсе
router.get('/:id', lessonController.getLessonById);

// Маршрут для создания нового курса
router.post('/cid/:courseId', lessonController.createLesson);

// Маршрут для обновления информации о курсе
router.put('/:id', lessonController.updateLesson);

// Маршрут для удаления курса
router.delete('/l/:id/c/:courseId', lessonController.deleteLesson);

module.exports = router;