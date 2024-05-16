const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

// Validation middleware for checking required fields
const validateRequiredFields = (fields) => {
  if (!fields || Object.values(fields).some(value => !value)) {
    throw new Error('Error: All fields are required');
  }
};

// Validation middleware for checking description length
const validateDescriptionLength = (description) => {
  if (description && description.length > 500) {
    throw new Error('Error: Description must be 500 characters or less');
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ user_id: req.user.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateRandomCode = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
};

const createCourse = async (req, res) => {
  try {
    let { title, description, section } = req.body;

    validateRequiredFields({ title, section });
    validateDescriptionLength(description);

    let sectionModified = section.replace(/\s+/g, '-');
    sectionModified = sectionModified.replace(/[^a-zA-Zа-яА-Я0-9]/g, '');
    sectionModified = sectionModified.startsWith('#') ? sectionModified : `#${sectionModified}`;

    if (description && description.length > 500) {
      description = description.substring(0, 500);
    }

    const code = generateRandomCode();

    const course = await Course.create({
      title,
      description,
      section: sectionModified,
      code,
      user_id: req.user.id,
      instructor: req.user.username
    });

    res.redirect('/api/courses');
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    if (course.user_id.toString() !== req.user.id) {
      res.status(403).json({ error: 'Permission denied' });
      return;
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedCourse) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    res.status(200).json({ success: true, updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    if (course.user_id.toString() !== req.user.id) {
      res.status(403).json({ error: 'Permission denied' });
      return;
    }

    await Lesson.deleteMany({ course_id: req.params.id });
    await Course.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true, deletedCourse: course });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ 'students.userId': req.user.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userUnenrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      res.status(400).json({ error: 'Course ID is required' });
      return;
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const isEnrolled = course.students.some(student => student.userId.toString() === req.user.id);

    if (!isEnrolled) {
      res.status(400).json({ error: 'User is not enrolled in the specified course' });
      return;
    }

    course.students = course.students.filter(student => student.userId.toString() !== req.user.id);
    await course.save();

    res.status(200).json({ success: true, unenrolledCourseId: courseId });
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const userEnrollCourse = async (req, res) => {
  try {
    const { courseCode } = req.body;

    if (!courseCode) {
      return res.status(400).json({ error: 'Course code is required' });
    }

    const course = await Course.findOne({ code: courseCode });
    if (!course) {
      return res.status(404).json({ error: 'Course not found with the provided code' });
    }

    const isEnrolled = course.students.some(student => student.userId.toString() === req.user.id);
    if (isEnrolled) {
      return res.status(400).json({ error: 'You are already enrolled in this course' });
    }

    course.students.push({
      userId: req.user.id,
      username: req.user.username,
      fname: req.user.fname,
      mname: req.user.mname,
      lname: req.user.lname,
    });

    await course.save();

    // Fetch all lessons of this course
    const lessons = await Lesson.find({ course_id: course._id });
    for (const lesson of lessons) {
      lesson.students.push({
        userId: req.user.id,
        username: req.user.username,
        fname: req.user.fname,
        mname: req.user.mname,
        lname: req.user.lname,
        lesson_grade: [], // initialize with empty or default values if needed
      });

      await lesson.save();
    }

    res.status(200).json({ success: true, enrolledCourse: course });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  userEnrollCourse,
  userUnenrollCourse,
  getAllEnrolledCourses,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
