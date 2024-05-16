const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');

exports.startTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user._id; // Assuming you have user ID from session or token

    // Check if the test exists
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).send('Test not found');
    }

    const attempt = new TestAttempt({ testId, userId });
    await attempt.save();
    res.status(201).send(attempt);
  } catch (error) {
    res.status(500).send({ message: 'Error starting test', error: error.message });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    const attempt = await TestAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).send('Attempt not found');
    }

    // Calculate score based on correct answers
    const test = await Test.findById(attempt.testId);
    let score = 0;
    test.questions.forEach(question => {
      const userAnswer = answers.find(ans => ans.questionId.equals(question._id));
      const correctOptions = question.options.filter(opt => opt.isCorrect).map(opt => opt._id.toString());
      if (userAnswer && arraysEqual(userAnswer.answer.sort(), correctOptions.sort())) {
        score++;
      }
    });

    attempt.answers = answers;
    attempt.score = score;
    attempt.completed = true;
    attempt.endTime = new Date();
    await attempt.save();

    res.status(200).send({ score: attempt.score, completed: attempt.completed });
  } catch (error) {
    res.status(500).send({ message: 'Error submitting test', error: error.message });
  }
};

// Helper function to compare two arrays
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}