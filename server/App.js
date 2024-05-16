const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const validateToken = require("./middleware/validateTokenHandler");
const validateTokenForUploads = require("./middleware/validateTokenForUploads");
const cors = require("cors");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const app = express();
const Course = require("./models/Course");
const User = require("./models/User");
const File = require("./models/File");
const {verify} = require("jsonwebtoken");
const multer = require('multer');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/fileRoutes');

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
    sameSite: 'None',
    secure: true,
};


app.use(cors(corsOptions));
app.use((req, res, next) => {
    console.log('Incoming Request:', req.method, req.url);
    console.log('Cookies:', req.headers.cookie);
    next();
});
const port = process.env.PORT;
app.use(express.json());
app.use(
    session({
        secret: process.env.ACCESS_TOKEN_SECRET,
        resave: false,
        saveUninitialized: true,
    }),
);
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/lessons", require("./routes/lessonRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tests", require("./routes/testRoutes"));
app.use('/api/files', fileRoutes);

app.use(express.static("public"));
app.use(errorHandler);
app.use('/uploads', express.static('uploads'));
app.route("/validate").get((req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    verify(token.replace('Bearer ', ''), process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        res.json({ message: 'Token is valid' });
    });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});


const upload = multer({ storage: storage });

app.post('/upload/:lessonId', validateToken, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { lessonId } = req.params;
    const { type } = req.body; // Assuming type is sent as part of the form data

    if (!req.user) {
        return res.status(403).send('User not authenticated.');
    }

    // Check if the lesson exists
    try {
        const lesson = await mongoose.model('Lesson').findById(lessonId);
        if (!lesson) {
            return res.status(404).send('Lesson not found.');
        }

        if (!['instructor_assignment', 'student_submission'].includes(type)) {
            return res.status(400).send('Invalid file type specified.');
        }

        const fileData = {
            filename: req.file.filename,
            contentType: req.file.mimetype,
            lesson: lesson._id,
            userId: req.user.id,
            type: type // Save the type of the file
        };

        const newFile = new File(fileData);
        await newFile.save();

        res.status(201).send('File uploaded and metadata saved.');
    } catch (err) {
        console.error('Error handling the file upload:', err);
        res.status(500).send('Error saving metadata: ' + err.message);
    }
});


connectDb(); // Переместил вызов connectDb после определения app

app.listen(port, () => {
    console.log("Server on " + port);
});
