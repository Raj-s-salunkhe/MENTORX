import { useEffect, useState } from "react";

function MyAnalyses({ onOpenAnalysis }) {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadAnalyses = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/feasibility",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load analyses"
                );
            }

            setAnalyses(data.analyses || []);

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteAnalysis = async (id) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/feasibility/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete analysis"
                );
            }

            setAnalyses((current) =>
                current.filter(
                    (item) => item._id !== id
                )
            );

        } catch (error) {
            setMessage(error.message);
        }
    };

    useEffect(() => {
        loadAnalyses();
    }, []);

    if (loading) {
        return (
            <div className="analyses-page">
                <div className="loading-card">
                    <div className="loading-robot">
                        🤖
                    </div>

                    <h2>
                        Loading your analyses...
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="analyses-page">

            <div className="analyses-header">

                <p className="dashboard-tag">
                    MENTORX HISTORY
                </p>

                <h1>
                    My
                    <span> Feasibility Analyses</span>
                </h1>

                <p>
                    Click any saved report to open the full analysis.
                </p>

            </div>

            {message && (
                <div className="projects-message">
                    {message}
                </div>
            )}

            {analyses.length === 0 ? (

                <div className="empty-state">

                    <div>
                        📊
                    </div>

                    <h2>
                        No saved analyses yet
                    </h2>

                    <p>
                        Analyze a project and save the result.
                    </p>

                </div>

            ) : (

                <div className="analyses-grid">

                    {analyses.map((item) => (

                        <div
                            className="analysis-history-card"
                            key={item._id}
                            onClick={() =>
                                onOpenAnalysis(item._id)
                            }
                            style={{
                                cursor: "pointer"
                            }}
                        >

                            <div className="analysis-history-top">

                                <div>
                                    <small>
                                        PROJECT
                                    </small>

                                    <h2>
                                        {item.projectTitle}
                                    </h2>
                                </div>

                                <div className="history-score">
                                    {
                                        item.overallFeasibility?.score ??
                                        0
                                    }%
                                </div>

                            </div>

                            <div className="history-classification">
                                {
                                    item.overallFeasibility
                                        ?.classification ||
                                    "Unknown"
                                }
                            </div>

                            <div className="history-recommendation">

                                <span>
                                    Recommendation
                                </span>

                                <strong>
                                    {
                                        item.overallFeasibility
                                            ?.recommendation ||
                                        "Not available"
                                    }
                                </strong>

                            </div>

                            <div className="history-date">
                                Saved on{" "}
                                {item.createdAt
                                    ? new Date(
                                        item.createdAt
                                    ).toLocaleDateString()
                                    : "Unknown date"}
                            </div>

                            <button
                                className="delete-analysis-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAnalysis(item._id);
                                }}
                            >
                                Delete Analysis
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MyAnalyses;