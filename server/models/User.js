const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  mname: {
    type: String,
  },
  username: {
    type: String,
    required: [true, "Add username!"],
    unique: [true, "Not unique username!"]
  },
  email: {
    type: String,
    unique: [true, "Not unique email!"]
  },
  password: {
    type: String,
    required: [true, "Add pass!"],
  },
  role: {
    type: String,
    required: [true, "Add role!"],
  },
  lesson_grade: [{
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson' },
    grade: { // Changed from `lesson_grade` to `grade`
      type: Number, // Changed from String to Number
      min: 0,
      max: 100,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    }
  }],
  course_grade: [{
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    course_grade: String
  }]
});

userSchema.statics.findByUsername = async function (username) {
  return this.findOne({ username });
};

const User = mongoose.model('Users', userSchema);

module.exports = User;
