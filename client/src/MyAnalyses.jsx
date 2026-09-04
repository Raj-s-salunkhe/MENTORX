import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

const MyAnalyses = ({
    onBack,
    onOpenAnalysis
}) => {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");


    const getToken = () => {
        return localStorage.getItem("token");
    };


    /* =====================================================
       LOAD
    ===================================================== */

    const loadAnalyses = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/feasibility`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load analyses"
                );
            }

            setAnalyses(
                data.analyses || []
            );

        } catch (err) {
            console.error(
                "Load analyses error:",
                err
            );

            setError(
                err.message ||
                "Unable to load analyses"
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadAnalyses();
    }, []);


    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this analysis?"
            );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/feasibility/${id}`,
                {
                    method: "DELETE",

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
                    "Failed to delete analysis"
                );
            }

            setAnalyses(
                previous =>
                    previous.filter(
                        item =>
                            item._id !== id
                    )
            );

        } catch (err) {
            console.error(
                "Delete analysis error:",
                err
            );

            setError(err.message);
        }
    };


    /* =====================================================
       HELPERS
    ===================================================== */

    const getClassificationClass = (
        classification
    ) => {
        const value =
            String(
                classification || ""
            ).toLowerCase();

        if (
            value.includes("feasible") &&
            !value.includes("not")
        ) {
            return "analysis-feasible";
        }

        if (
            value.includes("difficult") ||
            value.includes("modification")
        ) {
            return "analysis-warning";
        }

        return "analysis-danger";
    };


    const filteredAnalyses =
        analyses.filter((item) => {

            const query =
                search.trim().toLowerCase();

            const title =
                item.projectTitle
                    ?.toLowerCase() || "";

            const classification =
                item.overallFeasibility
                    ?.classification
                    ?.toLowerCase() || "";

            const matchesSearch =
                !query ||
                title.includes(query) ||
                classification.includes(query);

            const matchesFilter =
                filter === "All" ||
                classificationMatches(
                    item,
                    filter
                );

            return (
                matchesSearch &&
                matchesFilter
            );
        });


    function classificationMatches(
        item,
        selected
    ) {
        const classification =
            String(
                item.overallFeasibility
                    ?.classification || ""
            ).toLowerCase();

        if (selected === "Feasible") {
            return (
                classification.includes(
                    "feasible"
                ) &&
                !classification.includes(
                    "not"
                )
            );
        }

        if (selected === "Needs Work") {
            return (
                classification.includes(
                    "difficult"
                ) ||
                classification.includes(
                    "modification"
                )
            );
        }

        if (selected === "Not Feasible") {
            return (
                classification.includes(
                    "not feasible"
                )
            );
        }

        return true;
    }


    const averageScore =
        analyses.length > 0
            ? Math.round(
                analyses.reduce(
                    (sum, item) =>
                        sum +
                        (
                            item
                                .overallFeasibility
                                ?.score || 0
                        ),
                    0
                ) / analyses.length
            )
            : 0;


    const feasibleCount =
        analyses.filter(item => {
            const classification =
                String(
                    item
                        .overallFeasibility
                        ?.classification || ""
                ).toLowerCase();

            return (
                classification.includes(
                    "feasible"
                ) &&
                !classification.includes(
                    "not"
                )
            );
        }).length;


    return (
        <div className="analyses-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="analyses-hero">

                <div className="analyses-hero-copy">

                    <button
                        className="analyses-back-btn"
                        onClick={onBack}
                    >
                        ← Back
                    </button>

                    <span className="analyses-eyebrow">
                        MENTORX ANALYTICS
                    </span>

                    <h1>
                        My
                        <span>
                            {" "}
                            Analyses.
                        </span>
                    </h1>

                    <p>
                        Review your saved AI
                        feasibility reports,
                        compare project scores,
                        and revisit your decisions.
                    </p>

                </div>


                <div className="analyses-header-orb">
                    <div className="analyses-orb-inner">
                        🧠
                    </div>
                </div>

            </section>


            {/* =================================================
                OVERVIEW
            ================================================= */}

            {!loading && !error && (
                <section className="analyses-overview">

                    <div className="analysis-overview-card">

                        <div className="overview-icon purple">
                            📊
                        </div>

                        <div>
                            <span>
                                TOTAL ANALYSES
                            </span>

                            <strong>
                                {analyses.length}
                            </strong>
                        </div>

                    </div>


                    <div className="analysis-overview-card">

                        <div className="overview-icon blue">
                            🎯
                        </div>

                        <div>
                            <span>
                                AVERAGE SCORE
                            </span>

                            <strong>
                                {averageScore}
                                <small>
                                    /100
                                </small>
                            </strong>
                        </div>

                    </div>


                    <div className="analysis-overview-card">

                        <div className="overview-icon green">
                            ✅
                        </div>

                        <div>
                            <span>
                                FEASIBLE PROJECTS
                            </span>

                            <strong>
                                {feasibleCount}
                            </strong>
                        </div>

                    </div>


                    <div className="analysis-overview-card">

                        <div className="overview-icon orange">
                            💡
                        </div>

                        <div>
                            <span>
                                DECISION TOOL
                            </span>

                            <strong className="overview-text">
                                AI Powered
                            </strong>
                        </div>

                    </div>

                </section>
            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="analyses-error">
                    <span>
                        ⚠️
                    </span>

                    <div>
                        <strong>
                            Something went wrong
                        </strong>

                        <p>
                            {error}
                        </p>
                    </div>

                    <button
                        className="analyses-retry-btn"
                        onClick={loadAnalyses}
                    >
                        Retry
                    </button>
                </div>
            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
                <div className="analyses-loading">

                    <div className="analyses-loading-icon">
                        🤖
                    </div>

                    <h2>
                        Loading your analyses
                    </h2>

                    <p>
                        Fetching your saved
                        feasibility reports...
                    </p>

                    <div className="analyses-loading-bar">
                        <div />
                    </div>

                </div>
            )}


            {/* =================================================
                TOOLBAR
            ================================================= */}

            {!loading &&
                !error &&
                analyses.length > 0 && (

                    <section className="analyses-toolbar">

                        <div className="analyses-search">

                            <span>
                                🔎
                            </span>

                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                            {search && (
                                <button
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    ×
                                </button>
                            )}

                        </div>


                        <div className="analyses-filters">

                            {[
                                "All",
                                "Feasible",
                                "Needs Work",
                                "Not Feasible"
                            ].map(
                                (option) => (

                                    <button
                                        key={option}
                                        className={
                                            filter === option
                                                ? "analysis-filter active"
                                                : "analysis-filter"
                                        }
                                        onClick={() =>
                                            setFilter(
                                                option
                                            )
                                        }
                                    >
                                        {option}
                                    </button>

                                )
                            )}

                        </div>

                    </section>
                )}


            {/* =================================================
                RESULT COUNT
            ================================================= */}

            {!loading &&
                !error &&
                analyses.length > 0 && (

                    <div className="analyses-result-line">

                        Showing{" "}
                        <strong>
                            {filteredAnalyses.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {analyses.length}
                        </strong>{" "}
                        analyses

                        {(search ||
                            filter !== "All") && (

                            <button
                                onClick={() => {
                                    setSearch("");
                                    setFilter("All");
                                }}
                            >
                                Clear filters
                            </button>
                        )}

                    </div>
                )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
                !error &&
                analyses.length === 0 && (

                    <div className="analyses-empty">

                        <div className="analyses-empty-icon">
                            🧠
                        </div>

                        <span className="analyses-empty-label">
                            NO REPORTS YET
                        </span>

                        <h2>
                            Your analysis library
                            is empty
                        </h2>

                        <p>
                            Run a feasibility analysis
                            on one of your projects and
                            save the report. Your saved
                            decisions will appear here.
                        </p>

                        <button
                            className="primary-btn"
                            onClick={onBack}
                        >
                            ← Start Exploring
                        </button>

                    </div>
                )}


            {/* =================================================
                NO SEARCH RESULTS
            ================================================= */}

            {!loading &&
                !error &&
                analyses.length > 0 &&
                filteredAnalyses.length === 0 && (

                    <div className="analyses-empty compact">

                        <div className="analyses-empty-icon">
                            🔍
                        </div>

                        <h2>
                            No matching analyses
                        </h2>

                        <p>
                            Try another project name
                            or change your filter.
                        </p>

                        <button
                            className="secondary-btn"
                            onClick={() => {
                                setSearch("");
                                setFilter("All");
                            }}
                        >
                            Reset
                        </button>

                    </div>
                )}


            {/* =================================================
                ANALYSIS CARDS
            ================================================= */}

            {!loading &&
                !error &&
                filteredAnalyses.length > 0 && (

                    <section className="analyses-list">

                        {filteredAnalyses.map(
                            (item, index) => {

                                const score =
                                    item
                                        .overallFeasibility
                                        ?.score ?? 0;

                                const classification =
                                    item
                                        .overallFeasibility
                                        ?.classification ||
                                    "Unknown";

                                const recommendation =
                                    item
                                        .overallFeasibility
                                        ?.recommendation ||
                                    "No recommendation";

                                const classificationClass =
                                    getClassificationClass(
                                        classification
                                    );

                                return (
                                    <article
                                        className={`analysis-row ${classificationClass}`}
                                        key={
                                            item._id
                                        }
                                    >

                                        {/* NUMBER */}

                                        <div className="analysis-row-number">
                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}
                                        </div>


                                        {/* PROJECT */}

                                        <div className="analysis-row-project">

                                            <div className="analysis-project-icon">
                                                🧠
                                            </div>

                                            <div>

                                                <h2>
                                                    {
                                                        item.projectTitle ||
                                                        "Untitled Project"
                                                    }
                                                </h2>

                                                <span>
                                                    AI Feasibility
                                                    Report
                                                </span>

                                            </div>

                                        </div>


                                        {/* SCORE */}

                                        <div className="analysis-score-block">

                                            <div className="analysis-score-ring">

                                                <svg
                                                    viewBox="0 0 44 44"
                                                >
                                                    <circle
                                                        cx="22"
                                                        cy="22"
                                                        r="18"
                                                        className="score-ring-bg"
                                                    />

                                                    <circle
                                                        cx="22"
                                                        cy="22"
                                                        r="18"
                                                        className="score-ring-progress"
                                                        strokeDasharray={`${
                                                            score *
                                                            1.13
                                                        } 113`}
                                                    />
                                                </svg>

                                                <strong>
                                                    {score}
                                                </strong>

                                            </div>

                                            <span>
                                                /100
                                            </span>

                                        </div>


                                        {/* CLASSIFICATION */}

                                        <div className="analysis-classification">

                                            <span className="analysis-class-label">
                                                STATUS
                                            </span>

                                            <strong>
                                                {classification}
                                            </strong>

                                            <small>
                                                {recommendation}
                                            </small>

                                        </div>


                                        {/* DATE */}

                                        <div className="analysis-date">

                                            <span>
                                                SAVED
                                            </span>

                                            <strong>
                                                {item.createdAt
                                                    ? new Date(
                                                        item.createdAt
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            day:
                                                                "2-digit",
                                                            month:
                                                                "short",
                                                            year:
                                                                "numeric"
                                                        }
                                                    )
                                                    : "N/A"}
                                            </strong>

                                            <small>
                                                {item.createdAt
                                                    ? new Date(
                                                        item.createdAt
                                                    ).toLocaleTimeString(
                                                        undefined,
                                                        {
                                                            hour:
                                                                "2-digit",
                                                            minute:
                                                                "2-digit"
                                                        }
                                                    )
                                                    : ""}
                                            </small>

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="analysis-row-actions">

                                            <button
                                                className="analysis-view-btn"
                                                onClick={() =>
                                                    onOpenAnalysis(
                                                        item._id
                                                    )
                                                }
                                            >
                                                View
                                                <span>
                                                    →
                                                </span>
                                            </button>

                                            <button
                                                className="analysis-delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        item._id
                                                    )
                                                }
                                                title="Delete analysis"
                                            >
                                                🗑️
                                            </button>

                                        </div>

                                    </article>
                                );
                            }
                        )}

                    </section>
                )}

        </div>
    );
};

export default MyAnalyses;