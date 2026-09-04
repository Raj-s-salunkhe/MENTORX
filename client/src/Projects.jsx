import { useEffect, useState } from "react";
import { apiUrl } from "./api";

function Projects({
    onOpenProject,
    onCreateProject
}) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const loadProjects = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                apiUrl("/api/projects"),
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to load projects"
                );
            }

            setProjects(
                data.projects || []
            );
        } catch (error) {
            console.error(
                "Projects loading failed:",
                error
            );

            setMessage(
                error.message ||
                    "Unable to load projects"
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadProjects();
    }, []);


    /* =========================
       JOIN PROJECT
    ========================= */

    const joinProject = async (
        projectId
    ) => {
        try {
            setMessage("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                apiUrl(
                    `/api/projects/${projectId}/join`
                ),
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Unable to join project"
                );
            }

            setMessage(
                data.message ||
                    "Joined project successfully ✅"
            );

            await loadProjects();

        } catch (error) {
            console.error(
                "Join project error:",
                error
            );

            setMessage(
                error.message ||
                    "Unable to connect to backend"
            );
        }
    };


    /* =========================
       SEARCH + FILTER
    ========================= */

    const filteredProjects =
        projects.filter((project) => {
            const query =
                search.trim().toLowerCase();

            const matchesSearch =
                !query ||
                project.title
                    ?.toLowerCase()
                    .includes(query) ||
                project.description
                    ?.toLowerCase()
                    .includes(query) ||
                project.category
                    ?.toLowerCase()
                    .includes(query) ||
                project.skillsRequired?.some(
                    (skill) =>
                        skill
                            .toLowerCase()
                            .includes(query)
                );

            const matchesFilter =
                filter === "All" ||
                project.difficulty === filter ||
                project.category === filter ||
                project.projectType === filter;

            return (
                matchesSearch &&
                matchesFilter
            );
        });


    const filterOptions = [
        "All",
        ...new Set(
            projects.flatMap((project) =>
                [
                    project.difficulty,
                    project.category,
                    project.projectType
                ].filter(Boolean)
            )
        )
    ];


    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <div className="projects-page projects-page-new">

                <div className="projects-loading">

                    <div className="projects-loading-icon">
                        🚀
                    </div>

                    <h2>
                        Loading Projects
                    </h2>

                    <p>
                        Finding opportunities
                        for you...
                    </p>

                    <div className="projects-loading-bar">
                        <div className="projects-loading-fill" />
                    </div>

                </div>

            </div>
        );
    }


    return (
        <div className="projects-page projects-page-new">

            {/* ==========================================
                HEADER
            ========================================== */}

            <section className="projects-hero">

                <div className="projects-hero-copy">

                    <span className="projects-eyebrow">
                        MENTORX PROJECT HUB
                    </span>

                    <h1>
                        Discover your next
                        <span>
                            {" "}
                            project.
                        </span>
                    </h1>

                    <p>
                        Explore student projects,
                        discover new opportunities,
                        and join teams that match
                        your skills and interests.
                    </p>

                </div>


                <div className="projects-hero-actions">

                    <div className="projects-total-card">

                        <span>
                            AVAILABLE
                        </span>

                        <strong>
                            {projects.length}
                        </strong>

                        <small>
                            projects
                        </small>

                    </div>


                    <button
                        className="primary-btn"
                        onClick={onCreateProject}
                    >
                        + Create Project
                    </button>

                </div>

            </section>


            {/* ==========================================
                MESSAGE
            ========================================== */}

            {message && (
                <div className="projects-message projects-message-new">
                    <span>ℹ️</span>
                    {message}
                </div>
            )}


            {/* ==========================================
                SEARCH / FILTER
            ========================================== */}

            <section className="projects-toolbar">

                <div className="projects-search">

                    <span>
                        🔎
                    </span>

                    <input
                        type="text"
                        placeholder="Search projects, skills, domains..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    {search && (
                        <button
                            className="projects-clear-search"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ×
                        </button>
                    )}

                </div>


                <div className="projects-filters">

                    {filterOptions
                        .slice(0, 8)
                        .map((option) => (

                            <button
                                key={option}
                                className={
                                    filter === option
                                        ? "project-filter active"
                                        : "project-filter"
                                }
                                onClick={() =>
                                    setFilter(
                                        option
                                    )
                                }
                            >
                                {option}
                            </button>

                        ))}

                </div>

            </section>


            {/* ==========================================
                RESULT INFO
            ========================================== */}

            <div className="projects-result-bar">

                <div>
                    <strong>
                        {filteredProjects.length}
                    </strong>{" "}
                    project
                    {filteredProjects.length !== 1
                        ? "s"
                        : ""}{" "}
                    found
                </div>

                {(search ||
                    filter !== "All") && (

                    <button
                        className="projects-reset-btn"
                        onClick={() => {
                            setSearch("");
                            setFilter("All");
                        }}
                    >
                        Clear filters
                    </button>

                )}

            </div>


            {/* ==========================================
                PROJECTS
            ========================================== */}

            {filteredProjects.length === 0 ? (

                <div className="projects-empty">

                    <div className="projects-empty-icon">
                        🔍
                    </div>

                    <h2>
                        No matching projects
                    </h2>

                    <p>
                        Try a different search
                        or remove the filters.
                    </p>

                    <button
                        className="secondary-btn"
                        onClick={() => {
                            setSearch("");
                            setFilter("All");
                        }}
                    >
                        Reset Search
                    </button>

                </div>

            ) : (

                <div className="projects-grid projects-grid-new">

                    {filteredProjects.map(
                        (project) => (

                            <article
                                className="project-card project-card-new"
                                key={project._id}
                            >

                                {/* TOP */}

                                <div className="project-card-top">

                                    <div className="project-type-icon">
                                        {project.projectType ===
                                        "Hardware"
                                            ? "🔧"
                                            : project.projectType ===
                                              "Research"
                                                ? "🔬"
                                                : project.projectType ===
                                                  "AI/ML"
                                                    ? "🧠"
                                                    : "💻"}
                                    </div>


                                    <span className="project-category">
                                        {project.category ||
                                            "General"}
                                    </span>


                                    <span
                                        className={`status-badge project-status ${
                                            String(
                                                project.status ||
                                                    "Open"
                                            )
                                                .toLowerCase()
                                                .replace(
                                                    /\s+/g,
                                                    "-"
                                                )
                                        }`}
                                    >
                                        {project.status ||
                                            "Open"}
                                    </span>

                                </div>


                                {/* TITLE */}

                                <button
                                    className="project-title-button"
                                    onClick={() =>
                                        onOpenProject(
                                            project._id
                                        )
                                    }
                                >
                                    {project.title}
                                </button>


                                {/* DESCRIPTION */}

                                <p className="project-description">
                                    {project.description ||
                                        "No description provided."}
                                </p>


                                {/* QUICK INFO */}

                                <div className="project-info project-info-new">

                                    <div>
                                        <span>
                                            DIFFICULTY
                                        </span>

                                        <strong>
                                            {project.difficulty ||
                                                "Not specified"}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            TEAM
                                        </span>

                                        <strong>
                                            👥{" "}
                                            {project.members
                                                ?.length ||
                                                0}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            TIME
                                        </span>

                                        <strong>
                                            ⏱️{" "}
                                            {project.estimatedDays ||
                                                "—"}{" "}
                                            {project.estimatedDays
                                                ? "days"
                                                : ""}
                                        </strong>
                                    </div>

                                </div>


                                {/* SKILLS */}

                                <div className="skill-tags project-skill-tags">

                                    {project.skillsRequired
                                        ?.slice(0, 5)
                                        .map(
                                            (skill) => (
                                                <span
                                                    key={
                                                        skill
                                                    }
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}

                                    {project.skillsRequired
                                        ?.length > 5 && (
                                        <span>
                                            +
                                            {project
                                                .skillsRequired
                                                .length -
                                                5}
                                        </span>
                                    )}

                                </div>


                                {/* FOOTER */}

                                <div className="project-card-footer">

                                    <div className="project-owner">

                                        <small>
                                            CREATED BY
                                        </small>

                                        <strong>
                                            {project
                                                .owner
                                                ?.name ||
                                                "Unknown"}
                                        </strong>

                                    </div>


                                    <div className="project-budget">

                                        <small>
                                            BUDGET
                                        </small>

                                        <strong>
                                            ₹
                                            {project
                                                .estimatedBudget ??
                                                0}
                                        </strong>

                                    </div>

                                </div>


                                {/* ACTIONS */}

                                <div className="project-card-actions">

                                    <button
                                        className="secondary-btn project-view-btn"
                                        onClick={() =>
                                            onOpenProject(
                                                project._id
                                            )
                                        }
                                    >
                                        View Project
                                        →
                                    </button>


                                    <button
                                        className="join-project-btn project-join-btn"
                                        onClick={() =>
                                            joinProject(
                                                project._id
                                            )
                                        }
                                    >
                                        Join
                                    </button>

                                </div>

                            </article>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default Projects;