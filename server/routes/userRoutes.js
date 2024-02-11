const express = require("express");
const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController');
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();


// Маршрут для создания нового курса
  
router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.get('/current', validateToken ,userController.userCurrent);
router.post('/logout', userController.userLogout);
router.get('/students', roleController.getAllStudents);
router.get('/instructors', roleController.getAllInstructors);
router.get('/:id', userController.findUserById);
router.get('/u/:username', userController.findUserByUsername);
module.exports = router;    