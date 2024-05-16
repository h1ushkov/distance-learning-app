const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const User = require('../models/User');
// Получение списка курсов
const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course_id: req.course.id });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получение списка всех уроков для конкретного курса
const getAllLessonsFromCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const lessons = await Lesson.find({ course_id: courseId });
    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Получение информации о конкретном уроке
const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Создание нового урока
const createLesson = async (req, res) => {
  try {
    const { title } = req.body;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);

    if (!title || !courseId || !course) {
      res.status(400).json({ error: "Error: All fields, including valid course ID, must be provided" });
      return;
    }

    // Get the list of students from the course
    const students = course.students.map(student => ({
      userId: student.userId,
      username: student.username,
      fname: student.fname,
      mname: student.mname,
      lname: student.lname,
      lesson_grade: [], // Initialize lesson grades as empty array
    }));

    // Create the lesson with the students from the course
    const lesson = await Lesson.create({
      title,
      course_id: courseId,
      students: students, // Assign the list of students to the lesson
    });

    res.status(201).json({ success: true, lesson });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Обновление информации о уроке
const updateLesson = async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const addMaterial = async (req, res) => {
  const { lessonId } = req.params; // ID of the lesson to update
  const { material } = req.body; // Text of the material to add

  // Validate the input
  if (!material || material.length > 10000) {
    return res.status(400).json({ error: 'Material text must be between 1 and 10,000 characters.' });
  }

  try {
    // Find the lesson by ID and update
    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { $push: { materials: material } }, // Push the new material into the materials array
      { new: true, safe: true, upsert: false } // Options for the update operation
    );

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found.' });
    }

    res.status(200).json({ success: true, message: 'Material added successfully.', updatedLesson: lesson });
  } catch (error) {
    console.error('Error adding material to lesson:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const deleteMaterial = async (req, res) => {
  const { lessonId, materialIndex } = req.params; // Assuming materialIndex is passed instead of materialId

  try {
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
          return res.status(404).json({ error: 'Lesson not found' });
      }

      // Check if the material index is within bounds
      if (materialIndex < 0 || materialIndex >= lesson.materials.length) {
          return res.status(400).json({ error: 'Invalid material index' });
      }

      // Remove the material at the specified index
      lesson.materials.splice(materialIndex, 1);

      await lesson.save();
      res.json({ success: true, message: 'Material deleted successfully', materials: lesson.materials });
  } catch (error) {
      console.error('Error deleting material:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Удаление урока
const deleteLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const courseId = req.params.courseId;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    if (lesson.course_id.toString() !== courseId) {
      res.status(403).json({ error: 'Permission denied' });
      return;
    }

    await Lesson.deleteOne({ _id: lessonId });
    res.status(200).json({ lessonId });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const updateGrade = async (req, res) => {
  const { userId, lessonId, grade } = req.params;

  try {
    const numericGrade = parseInt(grade, 10);
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
      return res.status(400).json({ error: 'Invalid grade value. Grade must be an integer between 0 and 100.' });
    }

    // Instantiate ObjectId properly
    const userIdObj = new ObjectId(userId);
    const lessonIdObj = new ObjectId(lessonId);

    const user = await User.findById(userIdObj);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const lessonIndex = user.lesson_grade.findIndex(lg => lg.lessonId.equals(lessonIdObj));
    if (lessonIndex === -1) {
      user.lesson_grade.push({ lessonId: lessonIdObj, grade: numericGrade });
    } else {
      user.lesson_grade[lessonIndex].grade = numericGrade;
    }

    await user.save();
    res.json({ success: true, message: 'Grade updated successfully', user });
  } catch (error) {
    console.error('Error updating user grade:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllLessonsFromCourse,
  updateGrade,
  addMaterial,
  deleteMaterial,
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
