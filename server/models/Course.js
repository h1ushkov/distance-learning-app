const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const courseSchema = new mongoose.Schema({
  user_id: {
type: mongoose.Schema.Types.ObjectId,
required: true,
ref: "User",
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  instructor: [{
    type: mongoose.Schema.Types.String,
required: true,
ref: "User",
  }],
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
      course_grade: Array,
      lesson_grade: Array,
    },
  ],
  section: {
    type: String
  },
  code: {
    type: String
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
