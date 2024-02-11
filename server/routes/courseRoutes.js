const express = require("express");
const courseController = require('../controllers/courseController');
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.use(validateToken);

router.get('/', courseController.getAllCourses);

router.get('/student', courseController.getAllEnrolledCourses);

router.post('/unenroll', courseController.userUnenrollCourse);
// Маршрут для получения информации о конкретном курсе
router.get('/:id', courseController.getCourseById);

// Маршрут для создания нового курса
router.post('/', courseController.createCourse);

// Маршрут для обновления информации о курсе
router.put('/:id', courseController.updateCourse);

// Маршрут для удаления курса
router.delete('/:id', courseController.deleteCourse);

router.post('/enroll', courseController.userEnrollCourse);
module.exports = router;