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
            required: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        skillsRequired: {
            type: [String],
            default: []
        },

        interestsRequired: {
            type: [String],
            default: []
        },

        category: {
            type: String,
            default: "General"
        },

        difficulty: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner"
        },

        status: {
            type: String,
            enum: ["Open", "In Progress", "Completed"],
            default: "Open"
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

module.exports = mongoose.model("Project", projectSchema);