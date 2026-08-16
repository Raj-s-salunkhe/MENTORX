const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            college,
            experienceLevel,
            skills,
            interests
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            college,
            experienceLevel,
            skills,
            interests
        });

        res.status(201).json({
            message: "User registered successfully 🎉",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                college: user.college,
                skills: user.skills,
                interests: user.interests
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful 🎉",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                college: user.college,
                skills: user.skills,
                interests: user.interests
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile loaded successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to load profile",
            error: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const {
            name,
            bio,
            college,
            experienceLevel,
            skills,
            interests,
            github,
            linkedin,
            availability
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                name,
                bio,
                college,
                experienceLevel,
                skills,
                interests,
                github,
                linkedin,
                availability
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile updated successfully ✅",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Profile update failed",
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
};