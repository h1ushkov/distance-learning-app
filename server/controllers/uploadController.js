const File = require('../models/File'); // Ensure this points to your file model

const getAllFiles = async (req, res) => {
    try {
        const files = await File.find({});
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFileById = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });
        res.json(file);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFilesByLessonId = async (req, res) => {
    try {
        const files = await File.find({ lesson: req.params.lessonId });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFilesByUserId = async (req, res) => {
    try {
        const files = await File.find({ userId: req.params.userId });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFile = async (req, res) => {
    try {
        const result = await File.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'File not found' });
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateFile = async (req, res) => {
    try {
        const file = await File.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!file) return res.status(404).json({ message: 'File not found' });
        res.json(file);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllFiles,
    getFileById,
    getFilesByLessonId,
    getFilesByUserId,
    deleteFile,
    updateFile
};
