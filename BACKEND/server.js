const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Note = require("./models/Note");
const cors = require("cors");
const Label = require("./models/Label");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authMiddleware = require("./middleware/authMiddleware");
const reminderRoutes = require("./Routes/reminderRoutes");
const noteRoutes = require("./Routes/noteRoutes");
const versionHistoryRoutes = require("./Routes/versionHistoryRoutes");

app.use(cors());

app.use(express.json());
app.use("/api/reminders", reminderRoutes);

app.use("/api", noteRoutes);
app.use("/api", versionHistoryRoutes);

dotenv.config();
console.log("JWT SECRET LOADED:", !!process.env.JWT_SECRET);
connectDB();

app.get("/api/labels", async (req, res) => {
  try {
    const labels = await Label.find().sort({ createdAt: -1 });
    res.json(labels);
  } catch (error) {
    console.log("Label Fetch Error : ", error);
    res.status(500).json({
      message: "Failed to Fetch labels",
    });
  }
});

app.post("/api/labels", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Label name is required",
      });
    }
    const label = await Label.create({
      name: name.trim(),
    });

    res.status(201).json(label);
  } catch (error) {
    res.status(500).json({
      message: "Failed to Create label",
    });
  }
});

app.put("/api/labels/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        messaqge: "Label name is required",
      });
    }
    const label = await Label.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { returnDocument: "after" },
    );
    if (!label) {
      return res.status(404).json({
        message: "Label Not found",
      });
    }
    res.json(label);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/api/labels/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const label = await Label.findByIdAndDelete(id);

    if (!label) {
      return res.status(404).json({
        message: "Label not Found",
      });
    }

    res.json({
      message: "Label deleted permanently",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/", async (req, res) => {
  const note = await Note.create({
    title: req.body.title,
    content: req.body.content,
  });
  res.json(note);
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "Email alreay registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User registered Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are requires",
      });
    }
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    console.log("LOGIN EMAIL:", normalizedEmail);
    console.log("USER FOUND:", !!user);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or Password",
      });
    }

    console.log("PASSWORD HASH EXISTS:", !!user.password);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      message: "Login Sucessful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Login Error: ", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

app.put("/api/auth/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Old password is incorrect",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({
      message: "password changes sucessfully",
    });
  } catch (error) {
    console.log("Change Password Error:", error);

    res.status(500).json({
      message: "Failed to change password",
    });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
})
