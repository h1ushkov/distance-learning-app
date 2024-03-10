const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const userRegister = async (req, res) => {
  try {
    const { fname, lname, mname, username, email, password, role } = req.body;
    if (
      !fname ||
      !lname ||
      !mname ||
      !username ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({ message: "Fail" });
    }

    const userAvailable = await User.findOne({ username });
    if (userAvailable) {
      return res.status(400).json({ message: "User already registered!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fname,
      lname,
      mname,
      username,
      email,
      role,
      password: hashedPassword,
    });
    console.log("User created", user);
    if (user) {
      return res
        .status(201)
        .json({ _id: user.id, username: user.username, email: user.email });
    } else {
      return res.status(400).json({ message: "User data is not valid" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "All fields are mandatory" });
      return;
    }

    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            fname: user.fname,
            lname: user.lname,
            mname: user.mname,
            username: user.username,
            email: user.email,
            role: user.role,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60m" }
      );

      // Set accessToken as a secure HTTP-only cookie
      res.cookie('accessToken', accessToken, { httpOnly: false, maxAge: 60 * 60 * 1000, sameSite: 'Lax', secure: true }); // maxAge is in milliseconds
      console.log(accessToken);

      // Redirect to the dashboard after successful login
      res.redirect("http://localhost:5173/");
    } else {
      res.status(401).json({ error: "Username or password is not valid" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userLogout = (req, res) => {
  try {
    // Clear user session
    req.session.destroy();

    // Remove access token cookie
    res.clearCookie("accessToken");

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed. Internal Server Error." });
  }
};

const userCurrent = async (req, res) => {
  try {
    // Assuming req.user contains the current user's information
    const currentUser = req.user;
    res.json(currentUser);
    // res.render('current-user.ejs', { user: currentUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const findUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Assuming you have a function like findById to find a user by ID
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
    // If you want to render a view (e.g., using EJS), uncomment the following line:
    // res.render('current-user.ejs', { user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const findUserByUsername = async (req, res) => {
  try {
    const userName = req.params.username;

    // Assuming you have defined the findByUsername static method in your model
    const user = await User.findByUsername(userName);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
    // If you want to render a view (e.g., using EJS), uncomment the following line:
    // res.render('current-user.ejs', { user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  findUserByUsername,
  findUserById,
  userRegister,
  userLogin,
  userCurrent,
  userLogout,
};
