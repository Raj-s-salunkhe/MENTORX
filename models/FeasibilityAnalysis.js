const mongoose = require("mongoose");

const feasibilityAnalysisSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        projectTitle: {
            type: String,
            required: true
        },

        overallFeasibility: {
            score: {
                type: Number,
                required: true,
                min: 0,
                max: 100
            },

            classification: {
                type: String,
                required: true
            },

            recommendation: {
                type: String,
                required: true
            },

            reason: {
                type: String,
                required: true
            }
        },

        technicalFeasibility: {
            score: {
                type: Number,
                min: 0,
                max: 100
            },

            analysis: String,

            strengths: {
                type: [String],
                default: []
            },

            risks: {
                type: [String],
                default: []
            },

            recommendations: {
                type: [String],
                default: []
            }
        },

        skillFeasibility: {
            score: {
                type: Number,
                min: 0,
                max: 100
            },

            analysis: String,

            skillMatches: {
                type: [String],
                default: []
            },

            skillGaps: {
                type: [String],
                default: []
            },

            recommendations: {
                type: [String],
                default: []
            }
        },

        timeFeasibility: {
            score: {
                type: Number,
                min: 0,
                max: 100
            },

            analysis: String,

            estimatedEffort: String,

            risks: {
                type: [String],
                default: []
            },

            recommendations: {
                type: [String],
                default: []
            }
        },

        financialFeasibility: {
            score: {
                type: Number,
                min: 0,
                max: 100
            },

            analysis: String,

            estimatedCostRange: String,

            risks: {
                type: [String],
                default: []
            },

            recommendations: {
                type: [String],
                default: []
            }
        },

        dataFeasibility: {
            score: {
                type: Number,
                min: 0,
                max: 100
            },

            analysis: String,

            requiredData: {
                type: [String],
                default: []
            },

            risks: {
                type: [String],
                default: []
            },

            recommendations: {
                type: [String],
                default: []
            }
        },

        resourceFeasibility: {
            score: {
                type: Number,
                min: 0,
                max: 100
            },

            analysis: String,

            requiredResources: {
                type: [String],
                default: []
            },

            risks: {
                type: [String],
                default: []
            },

            recommendations: {
                type: [String],
                default: []
            }
        },

        teamFeasibility: {
            score: {
                type: Number,
                min: 0,
                max: 100
            },

            analysis: String,

            teamStrengths: {
                type: [String],
                default: []
            },

            teamGaps: {
                type: [String],
                default: []
            },

            recommendations: {
                type: [String],
                default: []
            }
        },

        scalabilityFeasibility: {
            score: {
                type: Number,
                min: 0,
                max: 100
            },

            analysis: String,

            risks: {
                type: [String],
                default: []
            },

            recommendations: {
                type: [String],
                default: []
            }
        },

        commercialFeasibility: {
            score: {
                type: Number,
                min: 0,
                max: 100
            },

            analysis: String,

            commercialOpportunities: {
                type: [String],
                default: []
            },

            risks: {
                type: [String],
                default: []
            },

            recommendations: {
                type: [String],
                default: []
            }
        },

        skillGaps: {
            type: [String],
            default: []
        },

        majorRisks: {
            type: [
                {
                    risk: String,
                    severity: String,
                    impact: String,
                    mitigation: String
                }
            ],
            default: []
        },

        mvpRecommendation: {
            mvpFeatures: {
                type: [String],
                default: []
            },

            futureFeatures: {
                type: [String],
                default: []
            }
        },

        personalizedRecommendations: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "FeasibilityAnalysis",
    feasibilityAnalysisSchema
);