// controllers/testController.js
const Test = require('../models/Test');
const Lesson = require('../models/Lesson');

exports.createTest = async (req, res) => {
  try {
    const test = new Test({
      ...req.body,
      lessonId: req.body.lessonId
    });
    await test.save();
    res.status(201).send(test);
  } catch (error) {
    res.status(400).send({ message: 'Error creating test', error: error.message });
  }
};

exports.getTestsByLesson = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const tests = await Test.find({ lessonId }).populate('lessonId');
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tests", error: error.message });
  }
};

exports.getTest = async (req, res) => {
  const { id } = req.params;

  try {
    const test = await Test.findById(id).populate('lessonId');
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving test", error: error.message });
  }
};

exports.updateTest = async (req, res) => {
  const { id } = req.params;
  const { title, duration, questions } = req.body;

  try {
    const test = await Test.findByIdAndUpdate(id, { title, duration, questions }, { new: true });
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: "Error updating test", error: error.message });
  }
};

exports.deleteTest = async (req, res) => {
  const { id } = req.params;

  try {
    const test = await Test.findByIdAndDelete(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting test", error: error.message });
  }
};
