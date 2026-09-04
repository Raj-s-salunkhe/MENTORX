const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        bio: {
            type: String,
            default: ""
        },

        college: {
            type: String,
            default: ""
        },

        experienceLevel: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced"
            ],
            default: "Beginner"
        },

        skills: {
            type: [String],
            default: []
        },

        interests: {
            type: [String],
            default: []
        },

        preferredTechnologies: {
            type: [String],
            default: []
        },

        previousProjects: {
            type: [
                {
                    title: {
                        type: String,
                        trim: true
                    },

                    description: {
                        type: String,
                        default: ""
                    },

                    technologies: {
                        type: [String],
                        default: []
                    },

                    role: {
                        type: String,
                        default: ""
                    }
                }
            ],
            default: []
        },

        currentTeamSize: {
            type: Number,
            min: 1,
            default: 1
        },

        availableDevelopmentDays: {
            type: Number,
            min: 0,
            default: 0
        },

        availableBudget: {
            type: Number,
            min: 0,
            default: 0
        },

        github: {
            type: String,
            default: ""
        },

        linkedin: {
            type: String,
            default: ""
        },

        availability: {
            type: String,
            default: "Available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "User",
    userSchema
);