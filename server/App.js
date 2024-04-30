const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const validateToken = require("./middleware/validateTokenHandler");
const cors = require("cors");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const app = express();
const Course = require("./models/Course");
const {verify} = require("jsonwebtoken");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
    sameSite: 'Lax',
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
app.use(express.static("public"));
app.use(errorHandler);

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



connectDb(); // Переместил вызов connectDb после определения app

app.listen(port, () => {
    console.log("Server on " + port);
});
