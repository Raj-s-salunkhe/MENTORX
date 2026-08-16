import { useEffect, useState } from "react";

function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login first.");
                    setLoading(false);
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [profileResponse, projectsResponse] =
                    await Promise.all([
                        fetch(
                            "http://localhost:5000/api/auth/profile",
                            {
                                method: "GET",
                                headers
                            }
                        ),

                        fetch(
                            "http://localhost:5000/api/projects",
                            {
                                method: "GET",
                                headers
                            }
                        )
                    ]);

                const profileData =
                    await profileResponse.json();

                const projectsData =
                    await projectsResponse.json();

                if (!profileResponse.ok) {
                    throw new Error(
                        profileData.message ||
                        "Failed to load profile"
                    );
                }

                if (!projectsResponse.ok) {
                    throw new Error(
                        projectsData.message ||
                        "Failed to load projects"
                    );
                }

                setProfile(profileData.user);
                setProjects(projectsData.projects || []);

            } catch (error) {
                console.error(
                    "Dashboard loading failed:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="loading-card">
                    <div className="loading-robot">
                        🤖
                    </div>

                    <h2>
                        Loading MENTORX...
                    </h2>

                    <p>
                        Connecting to your dashboard
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="error-card">
                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Dashboard Error
                    </h2>

                    <p>
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <div className="dashboard-header">

                <div className="dashboard-welcome">

                    <p className="dashboard-tag">
                        MENTORX DASHBOARD
                    </p>

                    <h1>
                        Welcome back,
                        <span>
                            {" "}
                            {profile?.name || "Student"}
                        </span>
                    </h1>

                    <p className="dashboard-subtitle">
                        Your projects, skills and opportunities
                        in one place.
                    </p>

                </div>

                <div className="profile-mini-card">

                    <div className="profile-avatar">
                        {profile?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                    </div>

                    <div className="profile-mini-info">

                        <strong>
                            {profile?.name || "Student"}
                        </strong>

                        <small>
                            {profile?.college ||
                                "College not set"}
                        </small>

                    </div>

                </div>

            </div>

            <div className="dashboard-grid">

                <div className="dashboard-stat">

                    <div className="stat-icon">
                        🚀
                    </div>

                    <div>
                        <span>
                            Open Projects
                        </span>

                        <strong>
                            {projects.length}
                        </strong>
                    </div>

                </div>

                <div className="dashboard-stat">

                    <div className="stat-icon">
                        💻
                    </div>

                    <div>
                        <span>
                            Your Skills
                        </span>

                        <strong>
                            {profile?.skills?.length || 0}
                        </strong>
                    </div>

                </div>

                <div className="dashboard-stat">

                    <div className="stat-icon">
                        ❤️
                    </div>

                    <div>
                        <span>
                            Your Interests
                        </span>

                        <strong>
                            {profile?.interests?.length || 0}
                        </strong>
                    </div>

                </div>

            </div>

            <div className="dashboard-sections">

                <section className="dashboard-panel">

                    <div className="panel-heading">

                        <div className="panel-title">
                            <span className="panel-icon">
                                🚀
                            </span>

                            <div>
                                <h2>
                                    Open Projects
                                </h2>

                                <p>
                                    Projects looking for students
                                </p>
                            </div>
                        </div>

                        <span className="project-count">
                            {projects.length}
                        </span>

                    </div>

                    {projects.length === 0 ? (

                        <div className="empty-state">

                            <div>
                                📭
                            </div>

                            <h3>
                                No open projects
                            </h3>

                            <p>
                                New projects will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="project-list">

                            {projects.map((project) => (

                                <div
                                    className="project-item"
                                    key={project._id}
                                >

                                    <div className="project-main">

                                        <div className="project-title-row">

                                            <h3>
                                                {project.title}
                                            </h3>

                                            <span className="status-badge">
                                                {project.status}
                                            </span>

                                        </div>

                                        <p>
                                            {project.description}
                                        </p>

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

                                    <div className="project-meta">

                                        <span>
                                            {project.difficulty}
                                        </span>

                                        <span>
                                            👥{" "}
                                            {project.members?.length ||
                                                0}
                                        </span>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

                <section className="dashboard-panel">

                    <div className="panel-heading">

                        <div className="panel-title">

                            <span className="panel-icon">
                                ⚡
                            </span>

                            <div>
                                <h2>
                                    Quick Actions
                                </h2>

                                <p>
                                    Explore MENTORX
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="quick-actions">

                        <button className="action-card">

                            <div className="action-icon">
                                🤝
                            </div>

                            <div>
                                <strong>
                                    Find Teammates
                                </strong>

                                <span>
                                    Discover compatible teammates
                                </span>
                            </div>

                            <b>
                                →
                            </b>

                        </button>

                        <button className="action-card">

                            <div className="action-icon">
                                🤖
                            </div>

                            <div>
                                <strong>
                                    AI Mentor
                                </strong>

                                <span>
                                    Analyze your project idea
                                </span>
                            </div>

                            <b>
                                →
                            </b>

                        </button>

                        <button className="action-card">

                            <div className="action-icon">
                                👤
                            </div>

                            <div>
                                <strong>
                                    My Profile
                                </strong>

                                <span>
                                    Manage your skills and interests
                                </span>
                            </div>

                            <b>
                                →
                            </b>

                        </button>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default Dashboard;