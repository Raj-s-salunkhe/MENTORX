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
            interests,
            preferredTechnologies,
            previousProjects,
            currentTeamSize,
            availableDevelopmentDays,
            availableBudget,
            github,
            linkedin,
            availability,
            bio
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            bio: bio || "",
            college: college || "",
            experienceLevel:
                experienceLevel || "Beginner",
            skills: skills || [],
            interests: interests || [],
            preferredTechnologies:
                preferredTechnologies || [],
            previousProjects:
                previousProjects || [],
            currentTeamSize:
                Number(currentTeamSize) || 1,
            availableDevelopmentDays:
                Number(availableDevelopmentDays) || 0,
            availableBudget:
                Number(availableBudget) || 0,
            github: github || "",
            linkedin: linkedin || "",
            availability:
                availability || "Available"
        });

        res.status(201).json({
            message: "User registered successfully 🎉",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                college: user.college,
                experienceLevel: user.experienceLevel,
                skills: user.skills,
                interests: user.interests,
                preferredTechnologies:
                    user.preferredTechnologies,
                previousProjects:
                    user.previousProjects,
                currentTeamSize:
                    user.currentTeamSize,
                availableDevelopmentDays:
                    user.availableDevelopmentDays,
                availableBudget:
                    user.availableBudget,
                github: user.github,
                linkedin: user.linkedin,
                availability: user.availability,
                bio: user.bio
            }
        });

    } catch (error) {
        console.error(
            "Registration error:",
            error
        );

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
                message:
                    "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful 🎉",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                college: user.college,
                experienceLevel:
                    user.experienceLevel,
                skills: user.skills,
                interests: user.interests,
                preferredTechnologies:
                    user.preferredTechnologies,
                previousProjects:
                    user.previousProjects,
                currentTeamSize:
                    user.currentTeamSize,
                availableDevelopmentDays:
                    user.availableDevelopmentDays,
                availableBudget:
                    user.availableBudget,
                github: user.github,
                linkedin: user.linkedin,
                availability:
                    user.availability,
                bio: user.bio
            }
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user =
            await User.findById(req.userId)
                .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message:
                "Profile loaded successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to load profile",
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
            preferredTechnologies,
            previousProjects,
            currentTeamSize,
            availableDevelopmentDays,
            availableBudget,
            github,
            linkedin,
            availability
        } = req.body;

        const updateData = {
            name,
            bio,
            college,
            experienceLevel,
            skills,
            interests,
            preferredTechnologies,
            previousProjects,
            currentTeamSize:
                currentTeamSize !== undefined
                    ? Number(currentTeamSize)
                    : undefined,
            availableDevelopmentDays:
                availableDevelopmentDays !== undefined
                    ? Number(
                        availableDevelopmentDays
                    )
                    : undefined,
            availableBudget:
                availableBudget !== undefined
                    ? Number(availableBudget)
                    : undefined,
            github,
            linkedin,
            availability
        };

        Object.keys(updateData).forEach(
            (key) => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            }
        );

        const user =
            await User.findByIdAndUpdate(
                req.userId,
                updateData,
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
            message:
                "Profile updated successfully ✅",
            user
        });

    } catch (error) {
        console.error(
            "Profile update error:",
            error
        );

        res.status(500).json({
            message:
                "Profile update failed",
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