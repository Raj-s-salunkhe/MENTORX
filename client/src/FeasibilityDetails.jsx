import { useEffect, useState } from "react";

function FeasibilityDetails({ analysisId, onBack }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadAnalysis = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:5000/api/feasibility/${analysisId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load feasibility analysis"
                    );
                }

                setAnalysis(data.analysis);

            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadAnalysis();
    }, [analysisId]);

    if (loading) {
        return (
            <div className="analyses-page">
                <div className="loading-card">
                    <div className="loading-robot">
                        🤖
                    </div>
                    <h2>
                        Loading feasibility report...
                    </h2>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="analyses-page">
                <div className="error-card">
                    <h2>
                        Report not found
                    </h2>

                    <p>
                        {message}
                    </p>

                    <button
                        className="primary-btn"
                        onClick={onBack}
                    >
                        ← Back to My Analyses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="feasibility-page">

            <button
                className="back-button"
                onClick={onBack}
            >
                ← Back to My Analyses
            </button>

            <div className="feasibility-header">

                <p className="dashboard-tag">
                    SAVED FEASIBILITY REPORT
                </p>

                <h1>
                    {analysis.projectTitle}
                </h1>

                <p>
                    Saved on{" "}
                    {analysis.createdAt
                        ? new Date(
                            analysis.createdAt
                        ).toLocaleDateString()
                        : "Unknown date"}
                </p>

            </div>

            <div className="overall-feasibility-card">

                <div>

                    <p className="result-label">
                        OVERALL FEASIBILITY
                    </p>

                    <h2>
                        {analysis.overallFeasibility?.classification}
                    </h2>

                    <p>
                        {analysis.overallFeasibility?.reason}
                    </p>

                    <div className="decision-card">
                        <span>
                            Recommendation
                        </span>

                        <strong>
                            {analysis.overallFeasibility?.recommendation}
                        </strong>
                    </div>

                </div>

                <div className="overall-score">

                    <div className="score-circle score-good">

                        <strong>
                            {analysis.overallFeasibility?.score}%
                        </strong>

                        <span>
                            Feasibility
                        </span>

                    </div>

                </div>

            </div>

            <div className="feasibility-score-grid">

                <ScoreCard
                    title="Technical"
                    score={
                        analysis.technicalFeasibility?.score
                    }
                />

                <ScoreCard
                    title="Skills"
                    score={
                        analysis.skillFeasibility?.score
                    }
                />

                <ScoreCard
                    title="Time"
                    score={
                        analysis.timeFeasibility?.score
                    }
                />

                <ScoreCard
                    title="Financial"
                    score={
                        analysis.financialFeasibility?.score
                    }
                />

                <ScoreCard
                    title="Data"
                    score={
                        analysis.dataFeasibility?.score
                    }
                />

                <ScoreCard
                    title="Resources"
                    score={
                        analysis.resourceFeasibility?.score
                    }
                />

                <ScoreCard
                    title="Team"
                    score={
                        analysis.teamFeasibility?.score
                    }
                />

                <ScoreCard
                    title="Scalability"
                    score={
                        analysis.scalabilityFeasibility?.score
                    }
                />

                <ScoreCard
                    title="Commercial"
                    score={
                        analysis.commercialFeasibility?.score
                    }
                />

            </div>

            <div className="feasibility-two-column">

                <section className="feasibility-panel">

                    <div className="panel-title">
                        <span className="panel-icon">
                            🧠
                        </span>

                        <div>
                            <h2>
                                Skill Analysis
                            </h2>

                            <p>
                                Your skills vs requirements
                            </p>
                        </div>
                    </div>

                    <h3>
                        Skill Matches
                    </h3>

                    <AnalysisList
                        items={
                            analysis.skillFeasibility
                                ?.skillMatches
                        }
                        icon="✅"
                    />

                    <h3>
                        Skill Gaps
                    </h3>

                    <AnalysisList
                        items={
                            analysis.skillFeasibility
                                ?.skillGaps
                        }
                        icon="⚠"
                    />

                </section>

                <section className="feasibility-panel">

                    <div className="panel-title">
                        <span className="panel-icon">
                            ⏱️
                        </span>

                        <div>
                            <h2>
                                Time Analysis
                            </h2>

                            <p>
                                Development feasibility
                            </p>
                        </div>
                    </div>

                    <AnalysisScore
                        score={
                            analysis.timeFeasibility?.score
                        }
                        label="Time score"
                    />

                    <p className="analysis-text">
                        {analysis.timeFeasibility?.analysis}
                    </p>

                    <p className="effort-text">
                        {analysis.timeFeasibility?.estimatedEffort}
                    </p>

                </section>

            </div>

            <div className="feasibility-two-column">

                <section className="feasibility-panel">

                    <div className="panel-title">
                        <span className="panel-icon">
                            💻
                        </span>

                        <div>
                            <h2>
                                Technical Analysis
                            </h2>

                            <p>
                                Technical implementation
                            </p>
                        </div>
                    </div>

                    <AnalysisScore
                        score={
                            analysis.technicalFeasibility?.score
                        }
                        label="Technical score"
                    />

                    <p className="analysis-text">
                        {analysis.technicalFeasibility?.analysis}
                    </p>

                    <h3>
                        Strengths
                    </h3>

                    <AnalysisList
                        items={
                            analysis.technicalFeasibility
                                ?.strengths
                        }
                        icon="✅"
                    />

                    <h3>
                        Risks
                    </h3>

                    <AnalysisList
                        items={
                            analysis.technicalFeasibility
                                ?.risks
                        }
                        icon="⚠"
                    />

                </section>

                <section className="feasibility-panel">

                    <div className="panel-title">
                        <span className="panel-icon">
                            💰
                        </span>

                        <div>
                            <h2>
                                Financial Analysis
                            </h2>

                            <p>
                                Estimated cost feasibility
                            </p>
                        </div>
                    </div>

                    <AnalysisScore
                        score={
                            analysis.financialFeasibility?.score
                        }
                        label="Financial score"
                    />

                    <p className="analysis-text">
                        {analysis.financialFeasibility?.analysis}
                    </p>

                    <div className="cost-range-card">
                        {
                            analysis.financialFeasibility
                                ?.estimatedCostRange
                        }
                    </div>

                </section>

            </div>

            <section className="feasibility-panel">

                <div className="panel-title">
                    <span className="panel-icon">
                        ⚠️
                    </span>

                    <div>
                        <h2>
                            Major Risks
                        </h2>

                        <p>
                            Important project risks
                        </p>
                    </div>
                </div>

                <div className="risk-grid">

                    {analysis.majorRisks?.map(
                        (risk, index) => (
                            <div
                                className="risk-card"
                                key={`${risk.risk}-${index}`}
                            >
                                <div className="risk-header">

                                    <strong>
                                        {risk.risk}
                                    </strong>

                                    <span>
                                        {risk.severity}
                                    </span>

                                </div>

                                <p>
                                    {risk.impact}
                                </p>

                                <small>
                                    <strong>
                                        Mitigation:
                                    </strong>{" "}
                                    {risk.mitigation}
                                </small>
                            </div>
                        )
                    )}

                </div>

            </section>

            <section className="feasibility-panel">

                <div className="panel-title">
                    <span className="panel-icon">
                        🚀
                    </span>

                    <div>
                        <h2>
                            MVP Recommendation
                        </h2>

                        <p>
                            What should be built first
                        </p>
                    </div>
                </div>

                <div className="mvp-grid">

                    <div>
                        <h3>
                            Build First
                        </h3>

                        <AnalysisList
                            items={
                                analysis.mvpRecommendation
                                    ?.mvpFeatures
                            }
                            icon="✅"
                        />
                    </div>

                    <div>
                        <h3>
                            Future Features
                        </h3>

                        <AnalysisList
                            items={
                                analysis.mvpRecommendation
                                    ?.futureFeatures
                            }
                            icon="🔮"
                        />
                    </div>

                </div>

            </section>

            <section className="feasibility-panel">

                <div className="panel-title">
                    <span className="panel-icon">
                        💡
                    </span>

                    <div>
                        <h2>
                            Personalized Recommendations
                        </h2>

                        <p>
                            Recommendations based on your profile
                        </p>
                    </div>
                </div>

                <div className="recommendation-list">

                    {analysis.personalizedRecommendations?.map(
                        (item) => (
                            <div
                                className="recommendation-item"
                                key={item}
                            >
                                ✅ {item}
                            </div>
                        )
                    )}

                </div>

            </section>

        </div>
    );
}

function ScoreCard({ title, score }) {
    return (
        <div className="feasibility-score-card">
            <span>
                {title}
            </span>

            <strong>
                {score ?? 0}%
            </strong>
        </div>
    );
}

function AnalysisScore({ score, label }) {
    return (
        <div className="analysis-score-line">
            <span>
                {label}
            </span>

            <strong>
                {score ?? 0}%
            </strong>
        </div>
    );
}

function AnalysisList({ items = [], icon }) {
    return (
        <ul className="analysis-list">

            {items?.length > 0 ? (
                items.map((item) => (
                    <li key={item}>
                        {icon} {item}
                    </li>
                ))
            ) : (
                <li>
                    Nothing recorded.
                </li>
            )}

        </ul>
    );
}

export default FeasibilityDetails;