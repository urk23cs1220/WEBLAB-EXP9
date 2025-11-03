// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

// --- MongoDB Connection ---
mongoose.connect("mongodb://127.0.0.1:27017/travelDB")
    .then(() => console.log("MongoDB connected to travelDB"))
    .catch(err => console.log("MongoDB connection error:", err));

// ==========================================================
//          NEW: USER SCHEMA & MODEL
// ==========================================================
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true }); // 'timestamps: true' adds 'createdAt'

// Create the User model
const User = mongoose.model("User", userSchema, 'users');


// ==========================================================
//          NEW: AUTHENTICATION API ENDPOINTS
// ==========================================================

// --- 1. User Registration ---
app.post("/api/register", async (req, res) => {
    try {
        const { fullName, email, username, password, confirmPassword } = req.body;

        // Simple Validation
        if (password !== confirmPassword) {
            return res.json({ message: "Passwords do not match" });
        }

        // Check if user (email or username) already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.json({ message: "Email or Username already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.json({ message: "Registration successful! Please login." });

    } catch (err) {
        res.json({ message: `Error registering user: ${err.message}` });
    }
});

// --- 2. User Login ---
app.post("/api/login", async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        // Find user by email or username
        const user = await User.findOne({ 
            $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] 
        });

        if (!user) {
            return res.json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ message: "Invalid credentials" });
        }

        // Send success response (omitting password)
        res.json({ 
            message: "Login successful",
            user: { 
                id: user._id, 
                fullName: user.fullName, 
                username: user.username,
                email: user.email 
            }
        });

    } catch (err) {
        res.json({ message: `Error logging in: ${err.message}` });
    }
});


// ==========================================================
//          EXISTING: PACKAGE API ENDPOINTS
// ==========================================================
const Package = mongoose.model("Package", new mongoose.Schema({
    packageName: { type: String, required: true },
    packageCode: { type: String, required: true, unique: true },
    destination: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true }
}), 'packages');

// --- READ (Fetch) all packages ---
app.get("/api/packages", async (req, res) => {
    try {
        const packages = await Package.find();
        res.send(packages);
    } catch (err) {
        res.json({ message: "Error fetching packages" });
    }
});

// --- CREATE (Insert) a new package ---
app.post("/api/addPackage", async (req, res) => {
    try {
        const newPackage = new Package(req.body);
        await newPackage.save();
        res.json({ message: "Package Saved Successfully" });
    } catch (err) {
        if (err.code == 11000) {
            res.json({ message: `Package with code ${req.body.packageCode} already exists` });
        } else {
            res.json({ message: err.message });
        }
    }
});

// --- DELETE a package ---
app.post("/api/deletePackage", async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.body.id);
        res.json({ message: "Package deleted successfully" });
    } catch (err) {
        res.json({ message: "Error deleting package" });
    }
});

// --- Start Server ---
const PORT = 7000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});