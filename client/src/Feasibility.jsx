import { useEffect, useState } from "react";

function Feasibility() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");

    const [availableDays, setAvailableDays] = useState(60);
    const [availableBudget, setAvailableBudget] = useState(30000);
    const [teamSize, setTeamSize] = useState(1);

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/projects",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load projects"
                    );
                }

                setProjects(data.projects || []);
            } catch (error) {
                setMessage(error.message);
            }
        };

        loadProjects();
    }, []);

    const analyzeFeasibility = async () => {
        if (!selectedProject) {
            setMessage("Please select a project first.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setAnalysis(null);

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/feasibility/analyze",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        projectId: selectedProject,
                        availableDays: Number(availableDays),
                        availableBudget: Number(availableBudget),
                        currentTeamSize: Number(teamSize)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Feasibility analysis failed"
                );
            }

            setAnalysis(data.analysis);

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const saveAnalysis = async () => {
        if (!analysis || !selectedProject) {
            setMessage("Analyze a project first.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/feasibility/save",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        projectId: selectedProject,
                        availableDays: Number(availableDays),
                        availableBudget: Number(availableBudget),
                        currentTeamSize: Number(teamSize)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save analysis"
                );
            }

            setMessage(
                "Feasibility analysis saved successfully ✅"
            );

        } catch (error) {
            setMessage(error.message);
        }
    };

    const getScoreClass = (score = 0) => {
        if (score >= 75) return "score-good";
        if (score >= 60) return "score-medium";
        return "score-low";
    };

    return (
        <div className="feasibility-page">

            <div className="feasibility-header">

                <p className="dashboard-tag">
                    MENTORX PROJECT FEASIBILITY
                </p>

                <h1>
                    Can you actually
                    <span> build this?</span>
                </h1>

                <p>
                    MENTORX compares your project with your
                    skills, team, time, budget and resources.
                </p>

            </div>

            <div className="feasibility-input-card">

                <div className="panel-heading">
                    <div className="panel-title">
                        <span className="panel-icon">
                            🔍
                        </span>

                        <div>
                            <h2>
                                Project Analysis
                            </h2>

                            <p>
                                Select a project and provide your
                                current resources.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="feasibility-form">

                    <div className="feasibility-field">

                        <label>
                            Project
                        </label>

                        <select
                            value={selectedProject}
                            onChange={(e) =>
                                setSelectedProject(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Choose a project
                            </option>

                            {projects.map((project) => (
                                <option
                                    key={project._id}
                                    value={project._id}
                                >
                                    {project.title}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="feasibility-field">

                        <label>
                            Available Development Days
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={availableDays}
                            onChange={(e) =>
                                setAvailableDays(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="feasibility-field">

                        <label>
                            Available Budget (₹)
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={availableBudget}
                            onChange={(e) =>
                                setAvailableBudget(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="feasibility-field">

                        <label>
                            Current Team Size
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={teamSize}
                            onChange={(e) =>
                                setTeamSize(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

                {message && (
                    <div className="projects-message">
                        {message}
                    </div>
                )}

                <button
                    className="feasibility-analyze-btn"
                    onClick={analyzeFeasibility}
                    disabled={loading}
                >
                    {loading
                        ? "Analyzing Project..."
                        : "Analyze Feasibility 🤖"}
                </button>

            </div>

            {loading && (
                <div className="feasibility-loading">

                    <div className="loading-robot">
                        🤖
                    </div>

                    <h2>
                        MENTORX is analyzing your project...
                    </h2>

                    <p>
                        Comparing technical, skill, time,
                        financial and team feasibility.
                    </p>

                </div>
            )}

            {analysis && !loading && (
                <div className="feasibility-results">

                    <div className="overall-feasibility-card">

                        <div>

                            <p className="result-label">
                                OVERALL FEASIBILITY
                            </p>

                            <h2>
                                {analysis.projectTitle}
                            </h2>

                            <p>
                                {analysis.overallFeasibility.reason}
                            </p>

                        </div>

                        <div className="overall-score">

                            <div
                                className={`score-circle ${getScoreClass(
                                    analysis.overallFeasibility.score
                                )}`}
                            >
                                <strong>
                                    {analysis.overallFeasibility.score}%
                                </strong>

                                <span>
                                    {analysis.overallFeasibility.classification}
                                </span>
                            </div>

                        </div>

                    </div>

                    <div className="decision-card">

                        <span>
                            Recommendation
                        </span>

                        <strong>
                            {analysis.overallFeasibility.recommendation}
                        </strong>

                        <p>
                            {analysis.overallFeasibility.classification}
                        </p>

                    </div>

                    <div className="feasibility-score-grid">

                        <ScoreCard
                            title="Technical"
                            score={analysis.technicalFeasibility.score}
                        />

                        <ScoreCard
                            title="Skills"
                            score={analysis.skillFeasibility.score}
                        />

                        <ScoreCard
                            title="Time"
                            score={analysis.timeFeasibility.score}
                        />

                        <ScoreCard
                            title="Financial"
                            score={analysis.financialFeasibility.score}
                        />

                        <ScoreCard
                            title="Data"
                            score={analysis.dataFeasibility.score}
                        />

                        <ScoreCard
                            title="Resources"
                            score={analysis.resourceFeasibility.score}
                        />

                        <ScoreCard
                            title="Team"
                            score={analysis.teamFeasibility.score}
                        />

                        <ScoreCard
                            title="Scalability"
                            score={analysis.scalabilityFeasibility.score}
                        />

                        <ScoreCard
                            title="Commercial"
                            score={analysis.commercialFeasibility.score}
                        />

                    </div>

                    <div className="feasibility-two-column">

                        <section className="feasibility-panel">

                            <PanelTitle
                                icon="🧠"
                                title="Skill Gap Analysis"
                                subtitle="Your skills vs project requirements"
                            />

                            <h3>
                                Matched Skills
                            </h3>

                            <div className="skill-tags">

                                {analysis.skillFeasibility.skillMatches?.length > 0 ? (
                                    analysis.skillFeasibility.skillMatches.map(
                                        (skill) => (
                                            <span key={skill}>
                                                ✅ {skill}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <p>
                                        No direct skill matches found.
                                    </p>
                                )}

                            </div>

                            <h3>
                                Skill Gaps
                            </h3>

                            <div className="skill-tags skill-gap-tags">

                                {analysis.skillFeasibility.skillGaps?.length > 0 ? (
                                    analysis.skillFeasibility.skillGaps.map(
                                        (skill) => (
                                            <span key={skill}>
                                                ⚠ {skill}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <p>
                                        No major skill gaps detected.
                                    </p>
                                )}

                            </div>

                        </section>

                        <section className="feasibility-panel">

                            <PanelTitle
                                icon="⏱️"
                                title="Time Analysis"
                                subtitle="Development capacity"
                            />

                            <AnalysisScore
                                score={analysis.timeFeasibility.score}
                                label="Time feasibility"
                            />

                            <p className="analysis-text">
                                {analysis.timeFeasibility.analysis}
                            </p>

                            <p className="effort-text">
                                {analysis.timeFeasibility.estimatedEffort}
                            </p>

                            <h3>
                                Risks
                            </h3>

                            <AnalysisList
                                items={analysis.timeFeasibility.risks}
                                icon="⚠"
                            />

                            <h3>
                                Recommendations
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.timeFeasibility
                                        .recommendations
                                }
                                icon="✓"
                            />

                        </section>

                    </div>

                    <div className="feasibility-two-column">

                        <section className="feasibility-panel">

                            <PanelTitle
                                icon="💻"
                                title="Technical Feasibility"
                                subtitle="Architecture and implementation"
                            />

                            <AnalysisScore
                                score={
                                    analysis.technicalFeasibility.score
                                }
                                label="Technical score"
                            />

                            <p className="analysis-text">
                                {analysis.technicalFeasibility.analysis}
                            </p>

                            <h3>
                                Strengths
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.technicalFeasibility
                                        .strengths
                                }
                                icon="✓"
                            />

                            <h3>
                                Risks
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.technicalFeasibility
                                        .risks
                                }
                                icon="⚠"
                            />

                        </section>

                        <section className="feasibility-panel">

                            <PanelTitle
                                icon="💰"
                                title="Financial Analysis"
                                subtitle="Budget feasibility"
                            />

                            <AnalysisScore
                                score={
                                    analysis.financialFeasibility.score
                                }
                                label="Financial score"
                            />

                            <p className="analysis-text">
                                {analysis.financialFeasibility.analysis}
                            </p>

                            <div className="cost-range-card">
                                {
                                    analysis.financialFeasibility
                                        .estimatedCostRange
                                }
                            </div>

                            <h3>
                                Risks
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.financialFeasibility
                                        .risks
                                }
                                icon="⚠"
                            />

                            <h3>
                                Recommendations
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.financialFeasibility
                                        .recommendations
                                }
                                icon="✓"
                            />

                        </section>

                    </div>

                    <div className="feasibility-two-column">

                        <section className="feasibility-panel">

                            <PanelTitle
                                icon="👥"
                                title="Team Feasibility"
                                subtitle="Team capacity and skills"
                            />

                            <AnalysisScore
                                score={
                                    analysis.teamFeasibility.score
                                }
                                label="Team score"
                            />

                            <p className="analysis-text">
                                {analysis.teamFeasibility.analysis}
                            </p>

                            <h3>
                                Team Strengths
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.teamFeasibility
                                        .teamStrengths
                                }
                                icon="✓"
                            />

                            <h3>
                                Team Gaps
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.teamFeasibility
                                        .teamGaps
                                }
                                icon="⚠"
                            />

                        </section>

                        <section className="feasibility-panel">

                            <PanelTitle
                                icon="📈"
                                title="Scalability"
                                subtitle="Future growth assessment"
                            />

                            <AnalysisScore
                                score={
                                    analysis.scalabilityFeasibility.score
                                }
                                label="Scalability score"
                            />

                            <p className="analysis-text">
                                {analysis.scalabilityFeasibility.analysis}
                            </p>

                            <h3>
                                Risks
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.scalabilityFeasibility
                                        .risks
                                }
                                icon="⚠"
                            />

                            <h3>
                                Recommendations
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.scalabilityFeasibility
                                        .recommendations
                                }
                                icon="✓"
                            />

                        </section>

                    </div>

                    <div className="feasibility-two-column">

                        <section className="feasibility-panel">

                            <PanelTitle
                                icon="🗄️"
                                title="Data Feasibility"
                                subtitle="Data availability and privacy"
                            />

                            <AnalysisScore
                                score={
                                    analysis.dataFeasibility.score
                                }
                                label="Data score"
                            />

                            <p className="analysis-text">
                                {analysis.dataFeasibility.analysis}
                            </p>

                            <h3>
                                Required Data
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.dataFeasibility
                                        .requiredData
                                }
                                icon="📌"
                            />

                            <h3>
                                Risks
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.dataFeasibility
                                        .risks
                                }
                                icon="⚠"
                            />

                        </section>

                        <section className="feasibility-panel">

                            <PanelTitle
                                icon="🧰"
                                title="Resource Feasibility"
                                subtitle="Hardware, software and infrastructure"
                            />

                            <AnalysisScore
                                score={
                                    analysis.resourceFeasibility.score
                                }
                                label="Resource score"
                            />

                            <p className="analysis-text">
                                {analysis.resourceFeasibility.analysis}
                            </p>

                            <h3>
                                Required Resources
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.resourceFeasibility
                                        .requiredResources
                                }
                                icon="📌"
                            />

                            <h3>
                                Risks
                            </h3>

                            <AnalysisList
                                items={
                                    analysis.resourceFeasibility
                                        .risks
                                }
                                icon="⚠"
                            />

                        </section>

                    </div>

                    <section className="feasibility-panel">

                        <PanelTitle
                            icon="💼"
                            title="Industry / Commercial Feasibility"
                            subtitle="Real-world potential"
                        />

                        <AnalysisScore
                            score={
                                analysis.commercialFeasibility.score
                            }
                            label="Commercial score"
                        />

                        <p className="analysis-text">
                            {analysis.commercialFeasibility.analysis}
                        </p>

                        <h3>
                            Opportunities
                        </h3>

                        <AnalysisList
                            items={
                                analysis.commercialFeasibility
                                    .commercialOpportunities
                            }
                            icon="💡"
                        />

                        <h3>
                            Risks
                        </h3>

                        <AnalysisList
                            items={
                                analysis.commercialFeasibility
                                    .risks
                            }
                            icon="⚠"
                        />

                    </section>

                    <section className="feasibility-panel">

                        <PanelTitle
                            icon="⚠️"
                            title="Major Risks"
                            subtitle="Issues that could affect project success"
                        />

                        <div className="risk-grid">

                            {analysis.majorRisks?.length > 0 ? (
                                analysis.majorRisks.map(
                                    (item, index) => (
                                        <div
                                            className="risk-card"
                                            key={`${item.risk}-${index}`}
                                        >
                                            <div className="risk-header">
                                                <strong>
                                                    {item.risk}
                                                </strong>

                                                <span>
                                                    {item.severity}
                                                </span>
                                            </div>

                                            <p>
                                                {item.impact}
                                            </p>

                                            <small>
                                                <strong>
                                                    Mitigation:
                                                </strong>{" "}
                                                {item.mitigation}
                                            </small>
                                        </div>
                                    )
                                )
                            ) : (
                                <div className="no-risk">
                                    No major risks detected.
                                </div>
                            )}

                        </div>

                    </section>

                    <section className="feasibility-panel">

                        <PanelTitle
                            icon="🚀"
                            title="MVP Recommendation"
                            subtitle="Start small and expand later"
                        />

                        <div className="mvp-grid">

                            <div>
                                <h3>
                                    Build First
                                </h3>

                                <AnalysisList
                                    items={
                                        analysis.mvpRecommendation
                                            .mvpFeatures
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
                                            .futureFeatures
                                    }
                                    icon="🔮"
                                />
                            </div>

                        </div>

                    </section>

                    <section className="feasibility-panel">

                        <PanelTitle
                            icon="💡"
                            title="Personalized Recommendations"
                            subtitle="Based on your current situation"
                        />

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

                    <div className="feasibility-actions">

                        <button
                            className="feasibility-save-btn"
                            onClick={saveAnalysis}
                        >
                            💾 Save Analysis
                        </button>

                        <button
                            className="feasibility-analyze-btn"
                            onClick={analyzeFeasibility}
                        >
                            🔄 Analyze Again
                        </button>

                    </div>

                </div>
            )}

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
                {score}%
            </strong>
        </div>
    );
}

function PanelTitle({ icon, title, subtitle }) {
    return (
        <div className="panel-title">
            <span className="panel-icon">
                {icon}
            </span>

            <div>
                <h2>
                    {title}
                </h2>

                <p>
                    {subtitle}
                </p>
            </div>
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
                {score}%
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
                    No information available.
                </li>
            )}
        </ul>
    );
}

export default Feasibility;