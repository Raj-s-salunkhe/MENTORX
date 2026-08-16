import { useState } from "react";

function AIMentor() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Artificial Intelligence");
    const [difficulty, setDifficulty] = useState("Intermediate");

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const analyzeProject = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            setMessage("Please enter a title and description.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setAnalysis(null);

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/ai/analyze-project",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        category,
                        difficulty
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "AI analysis failed"
                );
            }

            setAnalysis(data.analysis);

        } catch (error) {
            console.error(error);
            setMessage(
                error.message || "Unable to connect to AI Mentor"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-mentor-page">

            <div className="ai-mentor-header">
                <p className="dashboard-tag">
                    MENTORX AI
                </p>

                <h1>
                    Turn your idea into a
                    <span> real project.</span>
                </h1>

                <p>
                    Describe your project and let MENTORX
                    analyze the requirements, technology stack,
                    roadmap, timeline and budget.
                </p>
            </div>

            <div className="ai-mentor-layout">

                <section className="ai-input-panel">

                    <div className="panel-heading">
                        <div className="panel-title">
                            <span className="panel-icon">
                                💡
                            </span>

                            <div>
                                <h2>
                                    Project Idea
                                </h2>

                                <p>
                                    Tell your AI Mentor about your idea.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        className="ai-form"
                        onSubmit={analyzeProject}
                    >

                        <label>
                            Project Title
                        </label>

                        <input
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="e.g. Smart Campus AI"
                        />

                        <label>
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Describe what your project should do..."
                            rows="6"
                        />

                        <div className="ai-form-row">

                            <div>
                                <label>
                                    Category
                                </label>

                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                >
                                    <option>
                                        Artificial Intelligence
                                    </option>

                                    <option>
                                        Web Development
                                    </option>

                                    <option>
                                        Mobile Development
                                    </option>

                                    <option>
                                        Cybersecurity
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label>
                                    Difficulty
                                </label>

                                <select
                                    value={difficulty}
                                    onChange={(e) =>
                                        setDifficulty(e.target.value)
                                    }
                                >
                                    <option>
                                        Beginner
                                    </option>

                                    <option>
                                        Intermediate
                                    </option>

                                    <option>
                                        Advanced
                                    </option>
                                </select>
                            </div>

                        </div>

                        {message && (
                            <div className="projects-message">
                                {message}
                            </div>
                        )}

                        <button
                            className="ai-analyze-btn"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "MENTORX is thinking..."
                                : "Analyze My Project 🤖"}
                        </button>

                    </form>

                </section>

                <section className="ai-result-panel">

                    {!analysis && !loading && (
                        <div className="ai-empty">

                            <div className="ai-big-robot">
                                🤖
                            </div>

                            <h2>
                                Your AI Mentor is ready
                            </h2>

                            <p>
                                Enter a project idea and MENTORX
                                will build a development plan.
                            </p>

                        </div>
                    )}

                    {loading && (
                        <div className="ai-empty">

                            <div className="ai-big-robot">
                                🤖
                            </div>

                            <h2>
                                Analyzing your idea...
                            </h2>

                            <p>
                                MENTORX is preparing your
                                project roadmap.
                            </p>

                        </div>
                    )}

                    {analysis && (
                        <div className="ai-results">

                            <div className="ai-summary-card">

                                <p className="result-label">
                                    PROJECT SUMMARY
                                </p>

                                <h2>
                                    {title}
                                </h2>

                                <p>
                                    {analysis.projectSummary}
                                </p>

                            </div>

                            <div className="ai-result-grid">

                                <div className="ai-result-card">

                                    <h3>
                                        📋 Requirements
                                    </h3>

                                    <ul>
                                        {analysis.extractedRequirements?.map(
                                            (item) => (
                                                <li key={item}>
                                                    {item}
                                                </li>
                                            )
                                        )}
                                    </ul>

                                </div>

                                <div className="ai-result-card">

                                    <h3>
                                        🛠 Technologies
                                    </h3>

                                    {analysis.technologies?.map(
                                        (technology) => (
                                            <div
                                                className="technology-item"
                                                key={technology.name}
                                            >
                                                <strong>
                                                    {technology.name}
                                                </strong>

                                                <span>
                                                    {technology.purpose}
                                                </span>
                                            </div>
                                        )
                                    )}

                                </div>

                            </div>

                            <div className="ai-result-card">

                                <h3>
                                    🧠 Required Skills
                                </h3>

                                <div className="skill-tags">
                                    {analysis.requiredSkills?.map(
                                        (skill) => (
                                            <span key={skill}>
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>

                            </div>

                            <div className="ai-result-card">

                                <h3>
                                    🗺️ Development Roadmap
                                </h3>

                                <div className="roadmap-list">

                                    {analysis.roadmap?.map(
                                        (phase, index) => (
                                            <div
                                                className="roadmap-item"
                                                key={phase.phase}
                                            >
                                                <div className="roadmap-number">
                                                    {index + 1}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {phase.phase}
                                                    </strong>

                                                    <span>
                                                        {phase.duration}
                                                    </span>

                                                    <ul>
                                                        {phase.tasks?.map(
                                                            (task) => (
                                                                <li key={task}>
                                                                    {task}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        )
                                    )}

                                </div>

                            </div>

                            <div className="ai-metrics">

                                <div>
                                    <span>
                                        Timeline
                                    </span>

                                    <strong>
                                        {analysis.estimatedDays} days
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Budget
                                    </span>

                                    <strong>
                                        ₹{analysis.estimatedBudget}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Complexity
                                    </span>

                                    <strong>
                                        {analysis.complexity}
                                    </strong>
                                </div>

                            </div>

                            <div className="ai-result-card">

                                <h3>
                                    💡 AI Suggestions
                                </h3>

                                <ul>
                                    {analysis.suggestions?.map(
                                        (suggestion) => (
                                            <li key={suggestion}>
                                                {suggestion}
                                            </li>
                                        )
                                    )}
                                </ul>

                            </div>

                        </div>
                    )}

                </section>

            </div>

        </div>
    );
}

export default AIMentor;