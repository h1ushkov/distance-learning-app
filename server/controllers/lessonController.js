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
      course_grade: [],
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

    res.redirect(`/api/lessons/cid/${courseId}`);
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Изменение оценки для конкретного пользователя в уроке
const updateUserGradeInLesson = async (req, res) => {
  try {
    const { lessonId, userId, newGrade } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const lessonIndex = user.lesson_grade.findIndex(item => item.lessonId.toString() === lessonId);
    if (lessonIndex === -1) {
      res.status(404).json({ error: 'User not enrolled in this lesson' });
      return;
    }

    user.lesson_grade[lessonIndex].lesson_grade = newGrade;
    await user.save();

    res.json({ success: true, message: 'Grade updated successfully' });
  } catch (error) {
    console.error('Error updating user grade:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateGrade = async (req, res) => {
  const { userId, lessonId, grade } = req.body; // Извлечение данных из тела запроса

  try {
    // Проверяем корректность оценки
    if (grade < 0 || grade > 100 || !Number.isInteger(Number(grade))) {
      return res.status(400).json({ error: 'Invalid grade value. Grade must be an integer between 0 and 100.' });
    }

    // Обновляем оценку пользователя
    const user = await User.findOneAndUpdate(
      { _id: userId, "lesson_grade.lessonId": lessonId },
      { 
        "$set": {
          "lesson_grade.$.grade": grade  // Обновляем оценку в массиве lesson_grade
        }
      },
      { new: true } // Возвращаем обновленный объект пользователя
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found or lesson not assigned.' });
    }

    res.json({ success: true, message: 'Grade updated successfully', user });
  } catch (error) {
    console.error('Error updating user grade:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  getAllLessonsFromCourse,
  updateUserGradeInLesson,
  updateGrade,
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
