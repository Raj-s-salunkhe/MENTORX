const mongoose = require("mongoose");

const skillAssessmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        skill: {
            type: String,
            required: true,
            trim: true
        },

        proficiency: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },

        assessmentScore: {
            type: Number,
            min: 0,
            max: 10,
            required: true
        },

        totalQuestions: {
            type: Number,
            default: 10
        },

        verified: {
            type: Boolean,
            default: true
        },

        assessedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "SkillAssessment",
    skillAssessmentSchema
);