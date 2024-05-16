// models/Test.js
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true, default: false }
});

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [optionSchema]
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true }, // Duration in minutes
  questions: [questionSchema],
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  }
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
