import { useEffect, useState } from "react";

function ProjectDetails({ projectId, onBack }) {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const loadProject = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/projects/${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load project"
                );
            }

            setProject(data.project);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProject();
    }, [projectId]);

    const joinProject = async () => {
        try {
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
                loadProject();
            }
        } catch (error) {
            setMessage("Unable to connect to backend");
        }
    };

    const leaveProject = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/projects/${projectId}/leave`,
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
                loadProject();
            }
        } catch (error) {
            setMessage("Unable to connect to backend");
        }
    };

    if (loading) {
        return (
            <div className="project-details-page">
                <div className="loading-card">
                    <div className="loading-robot">🚀</div>
                    <h2>Loading Project...</h2>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-details-page">
                <div className="error-card">
                    <h2>Project not found</h2>
                    <button onClick={onBack}>
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    const currentUserId = (() => {
        try {
            const user = JSON.parse(
                localStorage.getItem("user")
            );
            return user?.id || user?._id;
        } catch {
            return null;
        }
    })();

    const isMember = project.members?.some(
        (member) =>
            String(member._id || member) ===
            String(currentUserId)
    );

    const isOwner =
        String(project.owner?._id || project.owner) ===
        String(currentUserId);

    return (
        <div className="project-details-page">

            <button
                className="back-button"
                onClick={onBack}
            >
                ← Back to Projects
            </button>

            {message && (
                <div className="projects-message">
                    {message}
                </div>
            )}

            <div className="project-details-hero">

                <div className="project-details-main">

                    <div className="project-detail-tags">
                        <span className="project-category">
                            {project.category}
                        </span>

                        <span className="status-badge">
                            {project.status}
                        </span>
                    </div>

                    <h1>
                        {project.title}
                    </h1>

                    <p className="project-details-description">
                        {project.description}
                    </p>

                    <div className="project-details-actions">

                        {!isMember && (
                            <button
                                className="join-project-btn"
                                onClick={joinProject}
                            >
                                Join Project →
                            </button>
                        )}

                        {isMember && !isOwner && (
                            <button
                                className="leave-project-btn"
                                onClick={leaveProject}
                            >
                                Leave Project
                            </button>
                        )}

                        {isOwner && (
                            <span className="owner-label">
                                👑 You are the owner
                            </span>
                        )}

                    </div>

                </div>

                <div className="project-detail-summary">

                    <div>
                        <span>Difficulty</span>
                        <strong>
                            {project.difficulty}
                        </strong>
                    </div>

                    <div>
                        <span>Members</span>
                        <strong>
                            {project.members?.length || 0}
                        </strong>
                    </div>

                    <div>
                        <span>Category</span>
                        <strong>
                            {project.category}
                        </strong>
                    </div>

                </div>

            </div>

            <div className="project-details-grid">

                <section className="project-detail-panel">

                    <div className="panel-heading">
                        <div className="panel-title">
                            <span className="panel-icon">
                                💻
                            </span>

                            <div>
                                <h2>
                                    Required Skills
                                </h2>

                                <p>
                                    Skills needed for this project
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="detail-skills">
                        {project.skillsRequired?.map(
                            (skill) => (
                                <span key={skill}>
                                    {skill}
                                </span>
                            )
                        )}
                    </div>

                </section>

                <section className="project-detail-panel">

                    <div className="panel-heading">
                        <div className="panel-title">
                            <span className="panel-icon">
                                👥
                            </span>

                            <div>
                                <h2>
                                    Team Members
                                </h2>

                                <p>
                                    Current project members
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="team-list">

                        {project.members?.map(
                            (member) => (
                                <div
                                    className="team-member"
                                    key={member._id}
                                >
                                    <div className="team-avatar">
                                        {member.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "U"}
                                    </div>

                                    <div>
                                        <strong>
                                            {member.name}
                                        </strong>

                                        <span>
                                            {member.email}
                                        </span>
                                    </div>
                                </div>
                            )
                        )}

                    </div>

                </section>

            </div>

            <section className="project-detail-panel project-owner-panel">

                <div className="panel-heading">
                    <div className="panel-title">
                        <span className="panel-icon">
                            👑
                        </span>

                        <div>
                            <h2>
                                Project Owner
                            </h2>

                            <p>
                                Person who created this project
                            </p>
                        </div>
                    </div>
                </div>

                <div className="owner-profile">

                    <div className="team-avatar">
                        {project.owner?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                    </div>

                    <div>
                        <strong>
                            {project.owner?.name}
                        </strong>

                        <span>
                            {project.owner?.college}
                        </span>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default ProjectDetails;