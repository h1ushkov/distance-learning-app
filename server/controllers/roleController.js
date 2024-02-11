const User = require('../models/User');

// Получение списка курсов
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" });
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllInstructors,
  getAllAdmins,
  getAllStudents
};
