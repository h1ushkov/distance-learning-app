const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const lessonSchema = new mongoose.Schema({
  course_id:{
    type: mongoose.Schema.Types.ObjectId,
ref: "Course"
  },
  title: {
    type: String,
    required: true
  },
  materials: {
    type: Array
  },
  grade: {
    type: Array
  },
  students: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      username: String,
      fname: String,
      mname: String,
      lname: String,
    },
  ],
  assigments: {
    type: Array
  }
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
