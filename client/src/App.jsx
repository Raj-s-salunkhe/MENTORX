import { useEffect, useState } from "react";
import "./App.css";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Projects from "./Projects";
import ProjectDetails from "./ProjectDetails";
import Matchmaker from "./Matchmaker";
import AIMentor from "./AIMentor";
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
            index = (index + 1) % statuses.length;
            setAiStatus(statuses[index]);
        }, 3200);

        return () => {
            clearInterval(interval);
            setAiStatus("AI CORE ONLINE");
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

    const openProtectedPage = (targetPage) => {
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
        setSelectedProjectId(projectId);
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

    const openAnalysis = (analysisId) => {
        setSelectedAnalysisId(analysisId);
        setPage("feasibility-details");
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
                        setSelectedProjectId(null);
                        setSelectedAnalysisId(null);
                    }}
                >
                    MENTORX
                </div>


                <div className="nav-links">

                    <a
                        href="#home"
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
                            onClick={(e) => {
                                e.preventDefault();
                                setPage("dashboard");
                            }}
                        >
                            Dashboard
                        </a>
                    )}


                    <a
                        href="#projects"
                        onClick={(e) => {
                            e.preventDefault();
                            openProtectedPage("projects");
                        }}
                    >
                        Projects
                    </a>


                    <a
                        href="#matchmaker"
                        onClick={(e) => {
                            e.preventDefault();
                            openProtectedPage("matchmaker");
                        }}
                    >
                        Matchmaker
                    </a>


                    <a
                        href="#ai"
                        onClick={(e) => {
                            e.preventDefault();
                            openProtectedPage("ai-mentor");
                        }}
                    >
                        AI Mentor
                    </a>


                    <a
                        href="#feasibility"
                        onClick={(e) => {
                            e.preventDefault();
                            openProtectedPage("feasibility");
                        }}
                    >
                        Feasibility
                    </a>


                    {user && (
                        <a
                            href="#analyses"
                            onClick={(e) => {
                                e.preventDefault();
                                setPage("my-analyses");
                            }}
                        >
                            My Analyses
                        </a>
                    )}

                </div>


                {user ? (

                    <button
                        className="login-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

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

            </nav>


            {/* =========================
                AUTH
            ========================= */}

            {page === "login" && (
                <Login
                    onLogin={handleLogin}
                    onGoRegister={() =>
                        setPage("register")
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

            {page === "dashboard" && user && (
                <Dashboard
                    onProjects={() =>
                        setPage("projects")
                    }

                    onMatchmaker={() =>
                        setPage("matchmaker")
                    }

                    onAIMentor={() =>
                        setPage("ai-mentor")
                    }

                    onFeasibility={() =>
                        setPage("feasibility")
                    }
                />
            )}


            {/* =========================
                PROJECTS
            ========================= */}

            {page === "projects" && user && (
                <Projects
                    onOpenProject={openProject}
                    onCreateProject={createProject}
                />
            )}


            {/* =========================
                CREATE PROJECT
            ========================= */}

            {page === "create-project" &&
                user && (
                    <ProjectForm
                        onComplete={openProject}
                        onCancel={() =>
                            setPage("projects")
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
                        project={projectToEdit}
                        onComplete={openProject}
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
                            setPage("projects")
                        }
                        onEdit={editProject}
                    />
                )}


            {/* =========================
                MATCHMAKER
            ========================= */}

            {page === "matchmaker" && user && (
                <Matchmaker />
            )}


            {/* =========================
                AI MENTOR
            ========================= */}

            {page === "ai-mentor" && user && (
                <AIMentor />
            )}


            {/* =========================
                FEASIBILITY
            ========================= */}

            {page === "feasibility" && user && (
                <Feasibility />
            )}


            {/* =========================
                MY ANALYSES
            ========================= */}

            {page === "my-analyses" && user && (
                <MyAnalyses
                    onOpenAnalysis={
                        openAnalysis
                    }
                />
            )}


            {/* =========================
                FEASIBILITY DETAILS
            ========================= */}

            {page === "feasibility-details" &&
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

                        {/* =========================
                            LEFT HERO
                        ========================= */}

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

                                <i>→</i>

                                <span>
                                    ANALYZE
                                </span>

                                <i>→</i>

                                <span>
                                    MATCH
                                </span>

                                <i>→</i>

                                <span>
                                    BUILD
                                </span>

                            </div>

                        </div>


                        {/* =========================
                            AI CORE
                        ========================= */}

                        <div className="ai-core-stage">

                            {/* Ambient glow */}
                            <div className="ai-core-glow" />

                            {/* Orbital rings */}
                            <div className="ai-orbit ai-orbit-1" />
                            <div className="ai-orbit ai-orbit-2" />
                            <div className="ai-orbit ai-orbit-3" />


                            {/* Top status */}
                            <div className="ai-core-status">

                                <span className="status-dot" />

                                <span>
                                    {aiStatus}
                                </span>

                            </div>


                            {/* Main glass core */}
                            <div className="ai-core-panel">

                                <div className="core-grid" />

                                <div className="core-label">
                                    MENTORX
                                    <span>
                                        PROJECT INTELLIGENCE
                                    </span>
                                </div>


                                <div className="robot">

                                    <div
                                        className="mentor-mascot"
                                        role="img"
                                        aria-label="MENTORX AI mascot"
                                    >

                                        <div className="mascot-antenna" />

                                        <div className="mascot-head">

                                            <div className="mascot-face">

                                                <span className="mascot-eye mascot-eye-left" />

                                                <span className="mascot-eye mascot-eye-right" />

                                            </div>

                                        </div>

                                        <div className="mascot-body">

                                            <span className="mascot-core" />

                                        </div>

                                        <span className="mascot-arm mascot-arm-left" />

                                        <span className="mascot-arm mascot-arm-right" />

                                    </div>

                                </div>


                                {/* Core pulse */}
                                <div className="core-pulse" />

                                <div className="core-bottom">
                                    AI ENGINE ACTIVE
                                </div>

                            </div>


                            {/* =========================
                                FLOATING DATA CARDS
                            ========================= */}

                            <div className="ai-data-card ai-card-team">

                                <div className="ai-card-icon">
                                    ◈
                                </div>

                                <div>
                                    <span>
                                        TEAM MATCH
                                    </span>

                                    <strong>
                                        94%
                                    </strong>
                                </div>

                            </div>


                            <div className="ai-data-card ai-card-feasible">

                                <div className="ai-card-icon">
                                    ◉
                                </div>

                                <div>
                                    <span>
                                        FEASIBILITY
                                    </span>

                                    <strong>
                                        87 / 100
                                    </strong>
                                </div>

                            </div>


                            <div className="ai-data-card ai-card-skills">

                                <div className="ai-card-icon">
                                    ✦
                                </div>

                                <div>
                                    <span>
                                        SKILL GAP
                                    </span>

                                    <strong>
                                        3 skills
                                    </strong>
                                </div>

                            </div>


                            <div className="ai-data-card ai-card-time">

                                <div className="ai-card-icon">
                                    ◷
                                </div>

                                <div>
                                    <span>
                                        TIMELINE
                                    </span>

                                    <strong>
                                        28 days
                                    </strong>
                                </div>

                            </div>


                            {/* Bottom AI engine line */}
                            <div className="ai-engine-line">

                                <span />
                                <p>
                                    MENTORX AI ENGINE
                                </p>
                                <span />

                            </div>

                        </div>

                    </main>


                    {/* =========================
                        HERO FEATURES
                    ========================= */}

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