const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const lessonSchema = new mongoose.Schema({
  course_id:{
    type: mongoose.Schema.Types.ObjectId,
ref: "Course"
  },
//   course_desc:{
 //    type: mongoose.Schema.Types.String,
// ref: "Course"
 //  },
 //  course_code:{
 //    type: mongoose.Schema.Types.String,
// ref: "Course"
 //  },
 //  course_title:{
 //    type: mongoose.Schema.Types.String,
// ref: "Course"
 // },
  title: {
    type: String,
    required: true
  },
  materials: {
    type: Array
  },
  assigment: {
    type: Array
  },
  tests: [{
    type: Array
  }]
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
