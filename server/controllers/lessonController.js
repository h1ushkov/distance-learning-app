const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
// Получение списка курсов
const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({course_id : req.course.id});
res.json(lessons)
   // res.render('lessons-list.ejs', {lessons})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllLessonsFromCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Assuming you have a method in your Lesson model to fetch lessons by courseId
    const lessons = await Lesson.find({ course_id: courseId });
    res.json(lessons)
   // res.render('lessons-list.ejs', {lessons})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Получение информации о конкретном курсе
const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLesson = async (req, res) => {
  console.log(req.body);
  const { title } = req.body;
  const courseId = req.params.courseId;

  // Assuming you fetch the course details before calling this function
  const course = await Course.findById(courseId);

  if (!title || !courseId || !course) {
    res.status(400).json({ error: "Error: All fields, including valid course ID, must be provided" });
    return;
  }

  const lesson = await Lesson.create({
    title,
    course_id: courseId,
  //  course_desc: course.description,
  //  course_code: course.code,
  //  course_title: course.title
  });

  res.status(201).json({ success: true, lesson });
};

// Обновление информации о курсе
const updateLesson = async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Удаление курса
const deleteLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const courseId = req.params.courseId;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    // Check if the lesson belongs to the specified course
    if (lesson.course_id.toString() !== courseId) {
      res.status(403).json({ error: 'Permission denied' });
      return;
    }

    // Delete the lesson
    await Lesson.deleteOne({ _id: lessonId });

    // Redirect to the lessons list for the specific course
    res.redirect(res.get(`/api/lessons/cid/${courseId}`));
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  getAllLessonsFromCourse,
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
};
