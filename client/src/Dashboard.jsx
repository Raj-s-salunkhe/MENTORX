import { useEffect, useState } from "react";
import { apiUrl } from "./api";

function Dashboard({
    onProjects,
    onMatchmaker,
    onAIMentor,
    onFeasibility
}) {
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
                            apiUrl("/api/auth/profile"),
                            {
                                method: "GET",
                                headers
                            }
                        ),

                        fetch(
                            apiUrl("/api/projects"),
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
                setProjects(
                    projectsData.projects || []
                );
            } catch (err) {
                console.error(
                    "Dashboard loading failed:",
                    err
                );

                setError(
                    err.message ||
                        "Unable to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-loading">
                    <div className="dashboard-loading-orb">
                        🤖
                    </div>

                    <h2>Loading MENTORX</h2>

                    <p>
                        Preparing your workspace...
                    </p>

                    <div className="loading-bar">
                        <div className="loading-bar-fill"></div>
                    </div>
                </div>
            </div>
        );
    }

    /* =========================
       ERROR
    ========================= */

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-error">
                    <div className="dashboard-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Dashboard Unavailable
                    </h2>

                    <p>{error}</p>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const firstName =
        profile?.name?.split(" ")[0] ||
        "Student";

    const skillCount =
        profile?.skills?.length || 0;

    const interestCount =
        profile?.interests?.length || 0;

    const preferredTechCount =
        profile?.preferredTechnologies?.length ||
        0;

    const previousProjectCount =
        profile?.previousProjects?.length ||
        0;

    return (
        <div className="dashboard-page dashboard-page-new">

            {/* =========================
                HERO
            ========================= */}

            <section className="dashboard-hero">

                <div className="dashboard-hero-content">

                    <div className="dashboard-eyebrow">
                        <span className="dashboard-live-dot"></span>
                        MENTORX WORKSPACE
                    </div>

                    <h1>
                        Welcome back,
                        <span>
                            {" "}
                            {firstName}
                        </span>
                        👋
                    </h1>

                    <p>
                        Build smarter projects,
                        find the right teammates,
                        and turn your ideas into
                        reality.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginTop: "22px"
                        }}
                    >
                        <button
                            className="primary-btn"
                            onClick={onProjects}
                        >
                            🚀 Explore Projects
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={onFeasibility}
                        >
                            🎯 Check Feasibility
                        </button>
                    </div>

                </div>

                <div className="dashboard-profile-card">

                    <div className="dashboard-profile-avatar">
                        {profile?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                    </div>

                    <div className="dashboard-profile-details">

                        <strong>
                            {profile?.name ||
                                "Student"}
                        </strong>

                        <span>
                            {profile?.college ||
                                "College not set"}
                        </span>

                        <small>
                            {profile?.experienceLevel ||
                                "Beginner"}{" "}
                            · MENTORX Member
                        </small>

                    </div>
                </div>

            </section>


            {/* =========================
                METRICS
            ========================= */}

            <section className="dashboard-metrics">

                <div className="metric-card metric-primary">

                    <div className="metric-card-top">

                        <span className="metric-icon">
                            🚀
                        </span>

                        <span className="metric-label">
                            PROJECTS
                        </span>

                    </div>

                    <strong>
                        {projects.length}
                    </strong>

                    <p>
                        Available projects
                    </p>

                </div>


                <div className="metric-card">

                    <div className="metric-card-top">

                        <span className="metric-icon">
                            💻
                        </span>

                        <span className="metric-label">
                            SKILLS
                        </span>

                    </div>

                    <strong>
                        {skillCount}
                    </strong>

                    <p>
                        Skills in your profile
                    </p>

                </div>


                <div className="metric-card">

                    <div className="metric-card-top">

                        <span className="metric-icon">
                            ⚡
                        </span>

                        <span className="metric-label">
                            TECHNOLOGIES
                        </span>

                    </div>

                    <strong>
                        {preferredTechCount}
                    </strong>

                    <p>
                        Preferred technologies
                    </p>

                </div>


                <div className="metric-card">

                    <div className="metric-card-top">

                        <span className="metric-icon">
                            🧠
                        </span>

                        <span className="metric-label">
                            EXPERIENCE
                        </span>

                    </div>

                    <strong className="metric-experience">
                        {profile?.experienceLevel ||
                            "Beginner"}
                    </strong>

                    <p>
                        Current experience level
                    </p>

                </div>

            </section>


            {/* =========================
                MAIN GRID
            ========================= */}

            <section className="dashboard-main-grid">

                {/* PROJECTS */}

                <div className="dashboard-section-card">

                    <div className="dashboard-section-header">

                        <div>

                            <span className="section-kicker">
                                EXPLORE
                            </span>

                            <h2>
                                Open Projects
                            </h2>

                            <p>
                                Discover projects
                                that match your
                                interests.
                            </p>

                        </div>

                        <div className="dashboard-count">
                            {projects.length}
                        </div>

                    </div>


                    {projects.length === 0 ? (

                        <div className="dashboard-empty-state">

                            <div className="empty-icon">
                                📭
                            </div>

                            <h3>
                                No projects yet
                            </h3>

                            <p>
                                New project
                                opportunities
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="dashboard-project-list">

                            {projects
                                .slice(0, 6)
                                .map((project) => (

                                    <div
                                        className="dashboard-project-card"
                                        key={project._id}
                                        onClick={() =>
                                            onProjects()
                                        }
                                        style={{
                                            cursor: "pointer"
                                        }}
                                    >

                                        <div className="dashboard-project-icon">
                                            {project.projectType ===
                                            "Hardware"
                                                ? "🔧"
                                                : project.projectType ===
                                                  "Research"
                                                    ? "🔬"
                                                    : "💻"}
                                        </div>


                                        <div className="dashboard-project-content">

                                            <div className="dashboard-project-title">

                                                <h3>
                                                    {project.title}
                                                </h3>

                                                <span className="dashboard-status">
                                                    {project.status ||
                                                        "Open"}
                                                </span>

                                            </div>


                                            <p>
                                                {project.description ||
                                                    "Project description not available."}
                                            </p>


                                            <div className="dashboard-project-tags">

                                                {project.skillsRequired
                                                    ?.slice(0, 4)
                                                    .map((skill) => (

                                                        <span
                                                            key={skill}
                                                        >
                                                            {skill}
                                                        </span>

                                                    ))}

                                            </div>


                                            <div className="dashboard-project-meta">

                                                <span>
                                                    🎯{" "}
                                                    {project.difficulty ||
                                                        "Intermediate"}
                                                </span>

                                                <span>
                                                    👥{" "}
                                                    {project.members
                                                        ?.length ||
                                                        0}{" "}
                                                    members
                                                </span>

                                                {project.estimatedDays && (
                                                    <span>
                                                        ⏱️{" "}
                                                        {
                                                            project.estimatedDays
                                                        }{" "}
                                                        days
                                                    </span>
                                                )}

                                            </div>

                                        </div>


                                        <div className="dashboard-project-arrow">
                                            →
                                        </div>

                                    </div>

                                ))}

                        </div>

                    )}


                    {projects.length > 6 && (
                        <div className="dashboard-more-projects">
                            +{projects.length - 6} more projects
                        </div>
                    )}

                </div>


                {/* QUICK ACTIONS */}

                <div className="dashboard-section-card">

                    <div className="dashboard-section-header">

                        <div>

                            <span className="section-kicker">
                                TOOLS
                            </span>

                            <h2>
                                Quick Actions
                            </h2>

                            <p>
                                Jump into your
                                MENTORX tools.
                            </p>

                        </div>

                    </div>


                    <div className="dashboard-actions-list">

                        <button
                            className="dashboard-tool-card"
                            onClick={onMatchmaker}
                        >

                            <div className="tool-icon purple">
                                🤝
                            </div>

                            <div className="tool-content">

                                <strong>
                                    Find Teammates
                                </strong>

                                <span>
                                    Discover people
                                    with matching
                                    skills.
                                </span>

                            </div>

                            <span className="tool-arrow">
                                →
                            </span>

                        </button>


                        <button
                            className="dashboard-tool-card"
                            onClick={onAIMentor}
                        >

                            <div className="tool-icon blue">
                                🤖
                            </div>

                            <div className="tool-content">

                                <strong>
                                    AI Mentor
                                </strong>

                                <span>
                                    Analyze and improve
                                    your project idea.
                                </span>

                            </div>

                            <span className="tool-arrow">
                                →
                            </span>

                        </button>


                        <button
                            className="dashboard-tool-card"
                            onClick={onFeasibility}
                        >

                            <div className="tool-icon green">
                                🎯
                            </div>

                            <div className="tool-content">

                                <strong>
                                    Feasibility
                                </strong>

                                <span>
                                    Check if your project
                                    is realistic.
                                </span>

                            </div>

                            <span className="tool-arrow">
                                →
                            </span>

                        </button>


                        <button
                            className="dashboard-tool-card"
                            onClick={onProjects}
                        >

                            <div className="tool-icon orange">
                                🚀
                            </div>

                            <div className="tool-content">

                                <strong>
                                    Explore Projects
                                </strong>

                                <span>
                                    Browse available
                                    projects and teams.
                                </span>

                            </div>

                            <span className="tool-arrow">
                                →
                            </span>

                        </button>

                    </div>

                </div>

            </section>


            {/* =========================
                PROFILE
            ========================= */}

            <section className="dashboard-bottom-grid">

                <div className="dashboard-info-card">

                    <div className="dashboard-info-header">

                        <div>

                            <span className="section-kicker">
                                PROFILE
                            </span>

                            <h2>
                                Your Project Identity
                            </h2>

                        </div>

                        <span className="profile-complete-badge">
                            {skillCount > 0 &&
                            interestCount > 0
                                ? "Active"
                                : "Complete profile"}
                        </span>

                    </div>


                    <div className="profile-progress-row">

                        <div className="profile-progress-item">

                            <div className="progress-top">

                                <span>
                                    Skills
                                </span>

                                <strong>
                                    {skillCount}
                                </strong>

                            </div>

                            <div className="progress-track">

                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${Math.min(
                                            skillCount * 12.5,
                                            100
                                        )}%`
                                    }}
                                />

                            </div>

                        </div>


                        <div className="profile-progress-item">

                            <div className="progress-top">

                                <span>
                                    Interests
                                </span>

                                <strong>
                                    {interestCount}
                                </strong>

                            </div>

                            <div className="progress-track">

                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${Math.min(
                                            interestCount * 20,
                                            100
                                        )}%`
                                    }}
                                />

                            </div>

                        </div>


                        <div className="profile-progress-item">

                            <div className="progress-top">

                                <span>
                                    Previous Projects
                                </span>

                                <strong>
                                    {previousProjectCount}
                                </strong>

                            </div>

                            <div className="progress-track">

                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${Math.min(
                                            previousProjectCount * 20,
                                            100
                                        )}%`
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>


                <div className="dashboard-quote-card">

                    <div className="quote-symbol">
                        ✦
                    </div>

                    <p>
                        Great projects aren't
                        just built with code.
                        They're built with the
                        right people and the
                        right plan.
                    </p>

                    <span>
                        — MENTORX
                    </span>

                </div>

            </section>

        </div>
    );
}

export default Dashboard;