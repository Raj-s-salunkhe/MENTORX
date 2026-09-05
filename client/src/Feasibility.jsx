import React, { useEffect, useState } from "react";
import { apiUrl } from "./api";

const Feasibility = ({
    onBack,
    onOpenAnalyses
}) => {
    const [projects, setProjects] = useState([]);
    const [profile, setProfile] = useState(null);

    const [selectedProject, setSelectedProject] =
        useState("");

    const [analysis, setAnalysis] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");


    const getToken = () =>
        localStorage.getItem("token");


    /* =========================
       LOAD DATA
    ========================= */

    useEffect(() => {
        loadProjects();
        loadProfile();
    }, []);


    /* =========================
       LOAD PROJECTS
    ========================= */

    const loadProjects = async () => {
        try {
            const response = await fetch(
                apiUrl("/api/projects"),
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load projects"
                );
            }

            setProjects(
                data.projects || []
            );

        } catch (err) {
            console.error(
                "Projects error:",
                err
            );

            setError(
                err.message ||
                "Failed to fetch projects"
            );
        }
    };


    /* =========================
       LOAD PROFILE
    ========================= */

    const loadProfile = async () => {
        try {
            const response = await fetch(
                apiUrl("/api/auth/profile"),
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load profile"
                );
            }

            setProfile(
                data.user || data
            );

        } catch (err) {
            console.error(
                "Profile error:",
                err
            );
        }
    };


    /* =========================
       ANALYZE
    ========================= */

    const handleAnalyze = async () => {
        if (!selectedProject) {
            setError(
                "Please select a project first."
            );

            return;
        }

        try {
            setLoading(true);

            setError("");
            setMessage("");
            setAnalysis(null);

            const response =
                await fetch(
                    apiUrl(
                        "/api/feasibility/analyze"
                    ),
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${getToken()}`
                        },

                        body:
                            JSON.stringify({
                                projectId:
                                    selectedProject
                            })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Analysis failed"
                );
            }

            setAnalysis(
                data.analysis
            );

            setMessage(
                "AI analysis completed ✅"
            );

        } catch (err) {
            console.error(
                "Analysis error:",
                err
            );

            setError(
                err.message ||
                "Analysis failed"
            );

        } finally {
            setLoading(false);
        }
    };


    /* =========================
       SAVE
    ========================= */

    const handleSave = async () => {
        if (!selectedProject) {
            setError(
                "Please select a project."
            );

            return;
        }

        try {
            setSaving(true);

            setError("");
            setMessage("");

            const response =
                await fetch(
                    apiUrl(
                        "/api/feasibility/save"
                    ),
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${getToken()}`
                        },

                        body:
                            JSON.stringify({
                                projectId:
                                    selectedProject
                            })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save analysis"
                );
            }

            if (data.analysis) {
                setAnalysis(
                    data.analysis
                );
            }

            setMessage(
                "Analysis saved successfully ✅"
            );

        } catch (err) {
            console.error(
                "Save error:",
                err
            );

            setError(
                err.message ||
                "Failed to save analysis"
            );

        } finally {
            setSaving(false);
        }
    };


    /* =========================
       SELECTED PROJECT
    ========================= */

    const selectedProjectData =
        projects.find(
            (project) =>
                project._id ===
                selectedProject
        );


    /* =========================
       SCORE HELPER
    ========================= */

    const getScore = (key) => {
        return (
            analysis?.[key]?.score ??
            0
        );
    };


    return (
        <div className="page-container feasibility-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="page-header">

                <div>

                    <button
                        className="secondary-btn"
                        onClick={onBack}
                    >
                        ← Back
                    </button>

                    <h1>
                        AI Feasibility Analysis
                    </h1>

                    <p>
                        Find out whether you
                        can realistically
                        build a project.
                    </p>

                </div>


                <button
                    className="secondary-btn"
                    onClick={onOpenAnalyses}
                >
                    📊 My Analyses
                </button>

            </div>


            {/* =========================
                USER CAPABILITIES
            ========================= */}

            {profile && (
                <div className="card">

                    <h2>
                        Your Current Capabilities
                    </h2>

                    <div className="stats-grid">

                        <div className="stat-card">
                            <strong>
                                {
                                    profile.experienceLevel ||
                                    "Beginner"
                                }
                            </strong>

                            <span>
                                Experience
                            </span>
                        </div>


                        <div className="stat-card">
                            <strong>
                                {
                                    profile.skills?.length ||
                                    0
                                }
                            </strong>

                            <span>
                                Skills
                            </span>
                        </div>


                        <div className="stat-card">
                            <strong>
                                {
                                    profile.preferredTechnologies
                                        ?.length ||
                                    0
                                }
                            </strong>

                            <span>
                                Preferred Technologies
                            </span>
                        </div>


                        <div className="stat-card">
                            <strong>
                                {
                                    profile.previousProjects
                                        ?.length ||
                                    0
                                }
                            </strong>

                            <span>
                                Previous Projects
                            </span>
                        </div>


                        <div className="stat-card">
                            <strong>
                                {
                                    profile.currentTeamSize ||
                                    1
                                }
                            </strong>

                            <span>
                                Team Size
                            </span>
                        </div>


                        <div className="stat-card">
                            <strong>
                                {
                                    profile.availableDevelopmentDays ||
                                    0
                                }
                            </strong>

                            <span>
                                Available Days
                            </span>
                        </div>


                        <div className="stat-card">
                            <strong>
                                ₹
                                {
                                    profile.availableBudget ||
                                    0
                                }
                            </strong>

                            <span>
                                Available Budget
                            </span>
                        </div>

                    </div>

                </div>
            )}


            {/* =========================
                PROJECT SELECTION
            ========================= */}

            <div className="card">

                <h2>
                    Select Project
                </h2>


                <select
                    className="input"
                    value={selectedProject}
                    onChange={(e) => {

                        setSelectedProject(
                            e.target.value
                        );

                        setAnalysis(null);
                        setMessage("");
                        setError("");
                    }}
                >

                    <option value="">
                        -- Select Project --
                    </option>


                    {projects.map(
                        (project) => (
                            <option
                                key={project._id}
                                value={project._id}
                            >
                                {project.title}
                            </option>
                        )
                    )}

                </select>


                {/* PROJECT PREVIEW */}

                {selectedProjectData && (
                    <div
                        className="project-preview"
                        style={{
                            marginTop:
                                "20px"
                        }}
                    >

                        <h3>
                            {
                                selectedProjectData.title
                            }
                        </h3>

                        <p>
                            {
                                selectedProjectData.description
                            }
                        </p>

                    </div>
                )}


                <button
                    className="primary-btn"
                    onClick={handleAnalyze}
                    disabled={
                        loading ||
                        !selectedProject
                    }
                    style={{
                        marginTop:
                            "20px"
                    }}
                >
                    {loading
                        ? "🤖 Analyzing..."
                        : "🤖 Analyze Feasibility"}
                </button>

            </div>


            {/* =========================
                SUCCESS
            ========================= */}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}


            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* =========================
                RESULTS
            ========================= */}

            {analysis && (
                <div className="feasibility-results">

                    {/* OVERALL */}

                    <div className="card">

                        <h2>
                            Overall Feasibility
                        </h2>

                        <div
                            style={{
                                fontSize:
                                    "48px",

                                fontWeight:
                                    "bold"
                            }}
                        >
                            {
                                analysis
                                    .overallFeasibility
                                    ?.score ??
                                0
                            }/100
                        </div>


                        <h3>
                            {
                                analysis
                                    .overallFeasibility
                                    ?.classification ||
                                "Unknown"
                            }
                        </h3>


                        <p>
                            {
                                analysis
                                    .overallFeasibility
                                    ?.recommendation ||
                                "No recommendation"
                            }
                        </p>


                        <p>
                            {
                                analysis
                                    .overallFeasibility
                                    ?.reason ||
                                ""
                            }
                        </p>

                    </div>


                    {/* BREAKDOWN */}

                    <div className="card">

                        <h2>
                            Feasibility Breakdown
                        </h2>

                        <div className="stats-grid">

                            <div className="stat-card">
                                <strong>
                                    {getScore(
                                        "technicalFeasibility"
                                    )}
                                </strong>

                                <span>
                                    Technical
                                </span>
                            </div>


                            <div className="stat-card">
                                <strong>
                                    {getScore(
                                        "skillFeasibility"
                                    )}
                                </strong>

                                <span>
                                    Skills
                                </span>
                            </div>


                            <div className="stat-card">
                                <strong>
                                    {getScore(
                                        "timeFeasibility"
                                    )}
                                </strong>

                                <span>
                                    Time
                                </span>
                            </div>


                            <div className="stat-card">
                                <strong>
                                    {getScore(
                                        "financialFeasibility"
                                    )}
                                </strong>

                                <span>
                                    Financial
                                </span>
                            </div>


                            <div className="stat-card">
                                <strong>
                                    {getScore(
                                        "dataFeasibility"
                                    )}
                                </strong>

                                <span>
                                    Data
                                </span>
                            </div>


                            <div className="stat-card">
                                <strong>
                                    {getScore(
                                        "resourceFeasibility"
                                    )}
                                </strong>

                                <span>
                                    Resources
                                </span>
                            </div>


                            <div className="stat-card">
                                <strong>
                                    {getScore(
                                        "teamFeasibility"
                                    )}
                                </strong>

                                <span>
                                    Team
                                </span>
                            </div>


                            <div className="stat-card">
                                <strong>
                                    {getScore(
                                        "scalabilityFeasibility"
                                    )}
                                </strong>

                                <span>
                                    Scalability
                                </span>
                            </div>


                            <div className="stat-card">
                                <strong>
                                    {getScore(
                                        "commercialFeasibility"
                                    )}
                                </strong>

                                <span>
                                    Commercial
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* SKILLS */}

                    <div className="card">

                        <h2>
                            Skills
                        </h2>

                        <p>
                            {
                                analysis
                                    .skillFeasibility
                                    ?.analysis ||
                                ""
                            }
                        </p>


                        <h3>
                            Skill Matches
                        </h3>

                        <ul>
                            {(
                                analysis
                                    .skillFeasibility
                                    ?.skillMatches ||
                                []
                            ).map(
                                (skill, index) => (
                                    <li
                                        key={index}
                                    >
                                        ✅ {skill}
                                    </li>
                                )
                            )}
                        </ul>


                        <h3>
                            Skill Gaps
                        </h3>

                        <ul>
                            {(
                                analysis
                                    .skillFeasibility
                                    ?.skillGaps ||
                                []
                            ).map(
                                (skill, index) => (
                                    <li
                                        key={index}
                                    >
                                        ⚠️ {skill}
                                    </li>
                                )
                            )}
                        </ul>

                    </div>


                    {/* TECHNICAL */}

                    <div className="card">

                        <h2>
                            Technical Feasibility
                        </h2>

                        <p>
                            {
                                analysis
                                    .technicalFeasibility
                                    ?.analysis ||
                                ""
                            }
                        </p>

                    </div>


                    {/* TIME */}

                    <div className="card">

                        <h2>
                            Time Feasibility
                        </h2>

                        <p>
                            {
                                analysis
                                    .timeFeasibility
                                    ?.analysis ||
                                ""
                            }
                        </p>

                        <p>
                            <strong>
                                Estimated Effort:
                            </strong>{" "}
                            {
                                analysis
                                    .timeFeasibility
                                    ?.estimatedEffort ||
                                "N/A"
                            }
                        </p>

                    </div>


                    {/* FINANCIAL */}

                    <div className="card">

                        <h2>
                            Financial Feasibility
                        </h2>

                        <p>
                            {
                                analysis
                                    .financialFeasibility
                                    ?.analysis ||
                                ""
                            }
                        </p>

                        <p>
                            <strong>
                                Estimated Cost:
                            </strong>{" "}
                            {
                                analysis
                                    .financialFeasibility
                                    ?.estimatedCostRange ||
                                "N/A"
                            }
                        </p>

                    </div>


                    {/* TEAM */}

                    <div className="card">

                        <h2>
                            Team Feasibility
                        </h2>

                        <p>
                            {
                                analysis
                                    .teamFeasibility
                                    ?.analysis ||
                                ""
                            }
                        </p>

                    </div>


                    {/* SCALABILITY */}

                    <div className="card">

                        <h2>
                            Scalability
                        </h2>

                        <p>
                            {
                                analysis
                                    .scalabilityFeasibility
                                    ?.analysis ||
                                ""
                            }
                        </p>

                    </div>


                    {/* DATA */}

                    <div className="card">

                        <h2>
                            Data Feasibility
                        </h2>

                        <p>
                            {
                                analysis
                                    .dataFeasibility
                                    ?.analysis ||
                                ""
                            }
                        </p>

                    </div>


                    {/* RESOURCES */}

                    <div className="card">

                        <h2>
                            Resources
                        </h2>

                        <p>
                            {
                                analysis
                                    .resourceFeasibility
                                    ?.analysis ||
                                ""
                            }
                        </p>

                    </div>


                    {/* COMMERCIAL */}

                    <div className="card">

                        <h2>
                            Commercial / Industry
                        </h2>

                        <p>
                            {
                                analysis
                                    .commercialFeasibility
                                    ?.analysis ||
                                ""
                            }
                        </p>

                    </div>


                    {/* RISKS */}

                    <div className="card">

                        <h2>
                            🚨 Major Risks
                        </h2>

                        <ul>

                            {(
                                analysis
                                    .majorRisks ||
                                []
                            ).map(
                                (risk, index) => (
                                    <li
                                        key={index}
                                    >
                                        <strong>
                                            {risk.risk}
                                        </strong>

                                        {" — "}

                                        {risk.severity}
                                    </li>
                                )
                            )}

                        </ul>

                    </div>


                    {/* MVP */}

                    <div className="card">

                        <h2>
                            🚀 MVP Recommendation
                        </h2>


                        <h3>
                            MVP Features
                        </h3>

                        <ul>
                            {(
                                analysis
                                    .mvpRecommendation
                                    ?.mvpFeatures ||
                                []
                            ).map(
                                (feature, index) => (
                                    <li
                                        key={index}
                                    >
                                        {feature}
                                    </li>
                                )
                            )}
                        </ul>


                        <h3>
                            Future Features
                        </h3>

                        <ul>
                            {(
                                analysis
                                    .mvpRecommendation
                                    ?.futureFeatures ||
                                []
                            ).map(
                                (feature, index) => (
                                    <li
                                        key={index}
                                    >
                                        {feature}
                                    </li>
                                )
                            )}
                        </ul>

                    </div>


                    {/* PERSONALIZED */}

                    <div className="card">

                        <h2>
                            🎯 Personalized Recommendations
                        </h2>

                        <ul>
                            {(
                                analysis
                                    .personalizedRecommendations ||
                                []
                            ).map(
                                (item, index) => (
                                    <li
                                        key={index}
                                    >
                                        {item}
                                    </li>
                                )
                            )}
                        </ul>

                    </div>


                    {/* SAVE */}

                    <div className="card">

                        <button
                            className="primary-btn"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving
                                ? "💾 Saving..."
                                : "💾 Save Analysis"}
                        </button>


                        <button
                            className="secondary-btn"
                            onClick={onOpenAnalyses}
                            style={{
                                marginLeft:
                                    "10px"
                            }}
                        >
                            📊 My Analyses
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Feasibility;