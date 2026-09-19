import { useEffect, useState } from "react";
import "./App.css";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Projects from "./Projects";
import ProjectDetails from "./ProjectDetails";
import Matchmaker from "./Matchmaker";
import AIMentor from "./AIMentor";
import SkillVerification from "./SkillVerification";
import Feasibility from "./Feasibility";
import MyAnalyses from "./MyAnalyses";
import FeasibilityDetails from "./FeasibilityDetails";
import ProjectForm from "./ProjectForm";

function App() {
    const [page, setPage] = useState("home");

    const [selectedProjectId, setSelectedProjectId] =
        useState(null);

    const [projectToEdit, setProjectToEdit] =
        useState(null);

    const [selectedAnalysisId, setSelectedAnalysisId] =
        useState(null);

    const [aiStatus, setAiStatus] =
        useState("AI CORE ONLINE");

    const [user, setUser] = useState(() => {
        const savedUser =
            localStorage.getItem("user");

        try {
            return savedUser
                ? JSON.parse(savedUser)
                : null;
        } catch {
            return null;
        }
    });

    /* =========================
       AI CORE ANIMATION
    ========================= */

    useEffect(() => {
        if (page !== "home") return;

        const statuses = [
            "AI CORE ONLINE",
            "ANALYZING PROJECTS",
            "MATCHING TEAMMATES",
            "CHECKING FEASIBILITY",
            "OPTIMIZING ROADMAP"
        ];

        let index = 0;

        const interval = setInterval(() => {
            index =
                (index + 1) %
                statuses.length;

            setAiStatus(
                statuses[index]
            );
        }, 3200);

        return () => {
            clearInterval(interval);
            setAiStatus(
                "AI CORE ONLINE"
            );
        };
    }, [page]);

    /* =========================
       LOGIN
    ========================= */

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        setPage("dashboard");
    };

    /* =========================
       LOGOUT
    ========================= */

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

        setPage("home");

        setSelectedProjectId(null);
        setProjectToEdit(null);
        setSelectedAnalysisId(null);
    };

    /* =========================
       PROTECTED PAGE
    ========================= */

    const openProtectedPage = (
        targetPage
    ) => {
        if (user) {
            setPage(targetPage);
        } else {
            setPage("login");
        }
    };

    /* =========================
       PROJECT
    ========================= */

    const openProject = (projectId) => {
        setSelectedProjectId(
            projectId
        );

        setPage("project-details");
    };

    const createProject = () => {
        setSelectedProjectId(null);
        setProjectToEdit(null);

        setPage("create-project");
    };

    const editProject = (project) => {
        setProjectToEdit(project);

        setPage("edit-project");
    };

    /* =========================
       ANALYSIS
    ========================= */

    const openAnalysis = (
        analysisId
    ) => {
        setSelectedAnalysisId(
            analysisId
        );

        setPage(
            "feasibility-details"
        );
    };

    return (
        <div className="app">

            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="navbar">

                <div
                    className="logo"
                    onClick={() => {
                        setPage("home");

                        setSelectedProjectId(
                            null
                        );

                        setSelectedAnalysisId(
                            null
                        );
                    }}
                >
                    <span className="logo-mark" />
                    <span className="logo-text">
                        MENTORX
                    </span>
                </div>

                <div className="nav-links">

                    <a
                        href="#home"
                        data-active={
                            page === "home"
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            setPage("home");
                        }}
                    >
                        Home
                    </a>

                    {user && (
                        <a
                            href="#dashboard"
                            data-active={
                                page === "dashboard"
                            }
                            onClick={(e) => {
                                e.preventDefault();

                                setPage(
                                    "dashboard"
                                );
                            }}
                        >
                            Dashboard
                        </a>
                    )}

                    <a
                        href="#projects"
                        data-active={
                            page === "projects" ||
                            page === "project-details" ||
                            page === "create-project" ||
                            page === "edit-project"
                        }
                        onClick={(e) => {
                            e.preventDefault();

                            openProtectedPage(
                                "projects"
                            );
                        }}
                    >
                        Projects
                    </a>

                    <a
                        href="#matchmaker"
                        data-active={
                            page === "matchmaker"
                        }
                        onClick={(e) => {
                            e.preventDefault();

                            openProtectedPage(
                                "matchmaker"
                            );
                        }}
                    >
                        Matchmaker
                    </a>

                    <a
                        href="#ai"
                        data-active={
                            page === "ai-mentor"
                        }
                        onClick={(e) => {
                            e.preventDefault();

                            openProtectedPage(
                                "ai-mentor"
                            );
                        }}
                    >
                        AI Mentor
                    </a>

                    <a
                        href="#feasibility"
                        data-active={
                            page === "feasibility" ||
                            page === "feasibility-details"
                        }
                        onClick={(e) => {
                            e.preventDefault();

                            openProtectedPage(
                                "feasibility"
                            );
                        }}
                    >
                        Feasibility
                    </a>

                    <a
                        href="#skill-verification"
                        data-active={
                            page === "skill-verification"
                        }
                        onClick={(e) => {
                            e.preventDefault();

                            openProtectedPage(
                                "skill-verification"
                            );
                        }}
                    >
                        Skill Verification
                    </a>

                    {user && (
                        <a
                            href="#analyses"
                            data-active={
                                page === "my-analyses"
                            }
                            onClick={(e) => {
                                e.preventDefault();

                                setPage(
                                    "my-analyses"
                                );
                            }}
                        >
                            My Analyses
                        </a>
                    )}

                </div>

                <div className="nav-actions">
                    {user ? (
                        <div className="nav-user">
                            <div className="nav-user-avatar">
                                {user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "U"}
                            </div>
                            <button
                                className="login-btn"
                                onClick={
                                    handleLogout
                                }
                                title={`Signed in as ${user?.name || "user"}`}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            className="login-btn"
                            onClick={() =>
                                setPage("login")
                            }
                        >
                            Login
                        </button>
                    )}
                </div>

            </nav>

            {/* =========================
                AUTH
            ========================= */}

            {page === "login" && (
                <Login
                    onLogin={
                        handleLogin
                    }
                    onGoRegister={() =>
                        setPage(
                            "register"
                        )
                    }
                />
            )}

            {page === "register" && (
                <Register
                    onRegister={() =>
                        setPage("login")
                    }
                    onGoLogin={() =>
                        setPage("login")
                    }
                />
            )}

            {/* =========================
                DASHBOARD
            ========================= */}

            {page === "dashboard" &&
                user && (
                    <Dashboard
                        onProjects={() =>
                            setPage(
                                "projects"
                            )
                        }
                        onMatchmaker={() =>
                            setPage(
                                "matchmaker"
                            )
                        }
                        onAIMentor={() =>
                            setPage(
                                "ai-mentor"
                            )
                        }
                        onFeasibility={() =>
                            setPage(
                                "feasibility"
                            )
                        }
                        onSkillVerification={() =>
                            setPage(
                                "skill-verification"
                            )
                        }
                    />
                )}

            {/* =========================
                PROJECTS
            ========================= */}

            {page === "projects" &&
                user && (
                    <Projects
                        onOpenProject={
                            openProject
                        }
                        onCreateProject={
                            createProject
                        }
                    />
                )}

            {/* =========================
                CREATE PROJECT
            ========================= */}

            {page === "create-project" &&
                user && (
                    <ProjectForm
                        onComplete={
                            openProject
                        }
                        onCancel={() =>
                            setPage(
                                "projects"
                            )
                        }
                    />
                )}

            {/* =========================
                EDIT PROJECT
            ========================= */}

            {page === "edit-project" &&
                user &&
                projectToEdit && (
                    <ProjectForm
                        project={
                            projectToEdit
                        }
                        onComplete={
                            openProject
                        }
                        onCancel={() =>
                            setPage(
                                "project-details"
                            )
                        }
                    />
                )}

            {/* =========================
                PROJECT DETAILS
            ========================= */}

            {page === "project-details" &&
                user &&
                selectedProjectId && (
                    <ProjectDetails
                        projectId={
                            selectedProjectId
                        }
                        onBack={() =>
                            setPage(
                                "projects"
                            )
                        }
                        onEdit={
                            editProject
                        }
                    />
                )}

            {/* =========================
                MATCHMAKER
            ========================= */}

            {page === "matchmaker" &&
                user && (
                    <Matchmaker />
                )}

            {/* =========================
                AI MENTOR
            ========================= */}

            {page === "ai-mentor" &&
                user && (
                    <AIMentor />
                )}

            {/* =========================
                SKILL VERIFICATION
            ========================= */}

            {page === "skill-verification" &&
                user && (
                    <SkillVerification
                        onBack={() =>
                            setPage("dashboard")
                        }
                    />
                )}

            {/* =========================
                FEASIBILITY
            ========================= */}

            {page === "feasibility" &&
                user && (
                    <Feasibility
                        onBack={() =>
                            setPage(
                                "dashboard"
                            )
                        }
                        onOpenAnalyses={() =>
                            setPage(
                                "my-analyses"
                            )
                        }
                    />
                )}

            {/* =========================
                MY ANALYSES
            ========================= */}

            {page === "my-analyses" &&
                user && (
                    <MyAnalyses
                        onBack={() =>
                            setPage("dashboard")
                        }
                        onOpenAnalysis={
                            openAnalysis
                        }
                    />
                )}

            {/* =========================
                FEASIBILITY DETAILS
            ========================= */}

            {page ===
                "feasibility-details" &&
                user &&
                selectedAnalysisId && (
                    <FeasibilityDetails
                        analysisId={
                            selectedAnalysisId
                        }
                        onBack={() =>
                            setPage(
                                "my-analyses"
                            )
                        }
                    />
                )}

            {/* =========================
                HOME
            ========================= */}

            {page === "home" && (
                <>

                    <main className="hero hero-ai-core">

                        {/* LEFT HERO */}

                        <div className="hero-content">

                            <p className="tagline">
                                BUILD. CONNECT. GROW.
                            </p>

                            <h1>
                                Find your
                                <span>
                                    perfect team.
                                </span>
                            </h1>

                            <p className="description">
                                MENTORX helps students
                                discover projects, find
                                compatible teammates and
                                turn ideas into achievable
                                projects.
                            </p>

                            <div className="hero-buttons">

                                <button
                                    className="primary-btn"
                                    onClick={() =>
                                        openProtectedPage(
                                            "projects"
                                        )
                                    }
                                >
                                    Explore Projects
                                </button>

                                <button
                                    className="secondary-btn"
                                    onClick={() =>
                                        openProtectedPage(
                                            "feasibility"
                                        )
                                    }
                                >
                                    Check Feasibility
                                </button>

                            </div>

                            <div className="hero-flow">

                                <span>
                                    IDEA
                                </span>

                                <i>
                                    →
                                </i>

                                <span>
                                    ANALYZE
                                </span>

                                <i>
                                    →
                                </i>

                                <span>
                                    MATCH
                                </span>

                                <i>
                                    →
                                </i>

                                <span>
                                    BUILD
                                </span>

                            </div>

                        </div>

                        {/* =========================
                            PROJECT INTELLIGENCE
                        ========================= */}

                        <div className="pi-stage">
                            <div className="pi-stage-inner">

                            <svg
                                className="pi-connections"
                                aria-hidden="true"
                                viewBox="0 0 480 480"
                                preserveAspectRatio="xMidYMid meet"
                            >

                                <g className="pi-line-glow">

                                    <line x1="240" y1="225" x2="240" y2="70" />

                                    <line x1="240" y1="225" x2="145" y2="225" />

                                    <line x1="240" y1="225" x2="369" y2="225" />

                                    <line x1="240" y1="225" x2="240" y2="394" />

                                    <line x1="240" y1="394" x2="240" y2="454" />

                                </g>

                                <g className="pi-line-sharp">

                                    <line x1="240" y1="225" x2="240" y2="70" />

                                    <line x1="240" y1="225" x2="145" y2="225" />

                                    <line x1="240" y1="225" x2="369" y2="225" />

                                    <line x1="240" y1="225" x2="240" y2="394" />

                                    <line x1="240" y1="394" x2="240" y2="454" />

                                </g>

                                <polygon
                                    points="240,466 233,453 247,453"
                                    className="pi-arrow"
                                />

                            </svg>

                            <div className="pi-glow" />

                            {/* CENTRAL NODE */}

                            <div className="pi-center">

                                <span className="pi-ring pi-ring-1" />

                                <span className="pi-ring pi-ring-2" />

                                <div className="pi-card">

                                    <span className="pi-eyebrow">
                                        MENTORX
                                    </span>

                                    <strong>PROJECT</strong>

                                    <strong>INTELLIGENCE</strong>

                                    <span className="pi-core" />

                                </div>

                            </div>

                            {/* SATELLITES */}

                            <div className="pi-node pi-node-top">

                                <span className="pi-icon">◈</span>

                                <span>AI ANALYSIS</span>

                            </div>

                            <div className="pi-node pi-node-left">

                                <span className="pi-icon">✦</span>

                                <span>VERIFIED SKILLS</span>

                            </div>

                            <div className="pi-node pi-node-right">

                                <span className="pi-icon">◈</span>

                                <span>TEAM</span>

                            </div>

                            <div className="pi-node pi-node-bottom">

                                <span className="pi-icon">◉</span>

                                <span>FEASIBILITY</span>

                            </div>

                            <div className="pi-node pi-node-mentor">

                                <span className="pi-icon">✦</span>

                                <span>AI MENTOR</span>

                            </div>

                        </div>

                    </div>

                    </main>

                    {/* FEATURES */}

                    <section className="features">

                        <div className="feature-card">

                            <h3>
                                🤝 Team Matchmaker
                            </h3>

                            <p>
                                Find teammates based
                                on skills, interests
                                and experience.
                            </p>

                        </div>

                        <div className="feature-card">

                            <h3>
                                🚀 Projects
                            </h3>

                            <p>
                                Discover projects and
                                join teams that match
                                your interests.
                            </p>

                        </div>

                        <div className="feature-card">

                            <h3>
                                🧠 Feasibility
                            </h3>

                            <p>
                                Check whether your
                                project is realistically
                                achievable.
                            </p>

                        </div>

                    </section>

                </>
            )}

        </div>
    );
}

export default App;