import { useEffect, useState } from "react";

function Projects({ onOpenProject }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const joinProject = async (projectId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/projects/${projectId}/join`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            setMessage(data.message);

            if (response.ok) {
                loadProjects();
            }

        } catch (error) {
            setMessage("Unable to connect to backend");
        }
    };

    if (loading) {
        return (
            <div className="projects-page">
                <div className="loading-card">
                    <div className="loading-robot">
                        🚀
                    </div>
                    <h2>Loading Projects...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="projects-page">

            <div className="projects-header">

                <div>
                    <p className="dashboard-tag">
                        MENTORX PROJECT HUB
                    </p>

                    <h1>
                        Discover your next
                        <span> project.</span>
                    </h1>

                    <p>
                        Find projects that match your
                        skills and interests.
                    </p>
                </div>

                <div className="projects-count">
                    <strong>
                        {projects.length}
                    </strong>

                    <span>
                        Open Projects
                    </span>
                </div>

            </div>

            {message && (
                <div className="projects-message">
                    {message}
                </div>
            )}

            <div className="projects-grid">

                {projects.map((project) => (

                    <div
                        className="project-card"
                        key={project._id}
                    >

                        <div
                            onClick={() =>
                                onOpenProject(project._id)
                            }
                            style={{
                                cursor: "pointer"
                            }}
                        >

                            <div className="project-card-top">

                                <span className="project-category">
                                    {project.category}
                                </span>

                                <span className="status-badge">
                                    {project.status}
                                </span>

                            </div>

                            <h2>
                                {project.title}
                            </h2>

                            <p className="project-description">
                                {project.description}
                            </p>

                            <div className="project-info">
                                <span>
                                    🎯 {project.difficulty}
                                </span>

                                <span>
                                    👥{" "}
                                    {project.members?.length || 0}
                                </span>
                            </div>

                            <div className="skill-tags">
                                {project.skillsRequired?.map(
                                    (skill) => (
                                        <span key={skill}>
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>

                        </div>

                        <div className="project-owner">
                            <small>
                                Created by
                            </small>

                            <strong>
                                {project.owner?.name ||
                                    "Unknown"}
                            </strong>
                        </div>

                        <button
                            className="join-project-btn"
                            onClick={() =>
                                joinProject(project._id)
                            }
                        >
                            Join Project →
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Projects;