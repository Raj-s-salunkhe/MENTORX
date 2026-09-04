const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        domain: {
            type: String,
            default: ""
        },

        projectType: {
            type: String,
            default: ""
        },

        problemStatement: {
            type: String,
            default: ""
        },

        objectives: {
            type: [String],
            default: []
        },

        keyFeatures: {
            type: [String],
            default: []
        },

        category: {
            type: String,
            default: "General"
        },

        skillsRequired: {
            type: [String],
            default: []
        },

        interestsRequired: {
            type: [String],
            default: []
        },

        recommendedTechnologies: {
            type: [String],
            default: []
        },

        estimatedDays: {
            type: Number,
            min: 0,
            default: 0
        },

        estimatedBudget: {
            type: Number,
            min: 0,
            default: 0
        },

        recommendedTeamSize: {
            type: Number,
            min: 1,
            default: 1
        },

        difficulty: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced"
            ],
            default: "Beginner"
        },

        status: {
            type: String,
            enum: [
                "Open",
                "In Progress",
                "Completed"
            ],
            default: "Open"
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Project",
    projectSchema
);
