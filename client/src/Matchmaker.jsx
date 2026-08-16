import { useEffect, useState } from "react";

function Matchmaker() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [matches, setMatches] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const loadProjects = async () => {
            try {
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
            } finally {
                setLoadingProjects(false);
            }
        };

        loadProjects();
    }, [token]);

    const findMatches = async () => {
        if (!selectedProject) {
            setMessage("Please select a project first.");
            return;
        }

        try {
            setLoadingMatches(true);
            setMessage("");
            setMatches([]);

            const response = await fetch(
                `http://localhost:5000/api/match/${selectedProject}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to find matches"
                );
            }

            setMatches(data.matches || []);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoadingMatches(false);
        }
    };

    return (
        <div className="matchmaker-page">

            <div className="matchmaker-header">
                <p className="dashboard-tag">
                    MENTORX TEAM MATCHMAKER
                </p>

                <h1>
                    Find your
                    <span> perfect teammates.</span>
                </h1>

                <p>
                    MENTORX compares skills, experience,
                    interests and availability to find
                    compatible teammates.
                </p>
            </div>

            <div className="matchmaker-selector">

                <div>
                    <label>
                        Select a project
                    </label>

                    {loadingProjects ? (
                        <div className="match-loading">
                            Loading projects...
                        </div>
                    ) : (
                        <select
                            value={selectedProject}
                            onChange={(e) =>
                                setSelectedProject(e.target.value)
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
                    )}
                </div>

                <button
                    className="find-match-btn"
                    onClick={findMatches}
                    disabled={loadingMatches}
                >
                    {loadingMatches
                        ? "Finding Matches..."
                        : "Find Teammates →"}
                </button>

            </div>

            {message && (
                <div className="projects-message">
                    {message}
                </div>
            )}

            {loadingMatches && (
                <div className="match-loading-card">
                    <div className="loading-robot">
                        🤖
                    </div>

                    <h2>
                        MENTORX is analyzing candidates...
                    </h2>

                    <p>
                        Comparing skills, experience and interests.
                    </p>
                </div>
            )}

            {!loadingMatches && matches.length > 0 && (
                <div className="matches-section">

                    <div className="matches-heading">
                        <div>
                            <p className="dashboard-tag">
                                MATCH RESULTS
                            </p>

                            <h2>
                                Best Teammates
                            </h2>

                            <p>
                                Ranked by compatibility score.
                            </p>
                        </div>

                        <div className="match-count">
                            {matches.length} matches
                        </div>
                    </div>

                    <div className="matches-grid">

                        {matches.map((match) => (

                            <div
                                className="match-card"
                                key={match.user.id}
                            >

                                <div className="match-card-header">

                                    <div className="match-user">

                                        <div className="match-avatar">
                                            {match.user.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U"}
                                        </div>

                                        <div>
                                            <h3>
                                                {match.user.name}
                                            </h3>

                                            <p>
                                                {match.user.college ||
                                                    "College not set"}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="compatibility-score">

                                        <strong>
                                            {match.totalScore}%
                                        </strong>

                                        <span>
                                            Match
                                        </span>

                                    </div>

                                </div>

                                <div className="match-bar-wrapper">
                                    <div className="match-bar">
                                        <div
                                            className="match-bar-fill"
                                            style={{
                                                width: `${match.totalScore}%`
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="match-breakdown">

                                    <div>
                                        <span>
                                            Skills
                                        </span>

                                        <strong>
                                            {match.skillScore}%
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Experience
                                        </span>

                                        <strong>
                                            {match.experienceScore}%
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Interests
                                        </span>

                                        <strong>
                                            {match.interestScore}%
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Availability
                                        </span>

                                        <strong>
                                            {match.availabilityScore}%
                                        </strong>
                                    </div>

                                </div>

                                <div className="match-skills">

                                    <p>
                                        Skills
                                    </p>

                                    <div className="skill-tags">

                                        {match.user.skills?.map(
                                            (skill) => (
                                                <span key={skill}>
                                                    {skill}
                                                </span>
                                            )
                                        )}

                                    </div>

                                </div>

                                <button className="invite-btn">
                                    Invite to Team
                                </button>

                            </div>

                        ))}

                    </div>

                </div>
            )}

            {!loadingMatches &&
                selectedProject &&
                matches.length === 0 &&
                !message && (
                    <div className="empty-state">
                        <div>🔍</div>

                        <h2>
                            No matching users found
                        </h2>

                        <p>
                            Try another project or add more
                            users to MENTORX.
                        </p>
                    </div>
                )}

        </div>
    );
}

export default Matchmaker;