const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    uploadDate: { type: Date, default: Date.now },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['instructor_assignment', 'student_submission'],
        required: true
    }
});
  const File = mongoose.model('File', fileSchema);
  module.exports = File;
