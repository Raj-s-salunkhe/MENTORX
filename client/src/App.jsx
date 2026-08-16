import { useState } from "react";
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

function App() {
    const [page, setPage] = useState("home");
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedAnalysisId, setSelectedAnalysisId] = useState(null);

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        setPage("dashboard");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setPage("home");
        setSelectedProjectId(null);
        setSelectedAnalysisId(null);
    };

    const openProtectedPage = (targetPage) => {
        if (user) {
            setPage(targetPage);
        } else {
            setPage("login");
        }
    };

    const openProject = (projectId) => {
        setSelectedProjectId(projectId);
        setPage("project-details");
    };

    const openAnalysis = (analysisId) => {
        setSelectedAnalysisId(analysisId);
        setPage("feasibility-details");
    };

    return (
        <div className="app">

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
                        onClick={() => setPage("login")}
                    >
                        Login
                    </button>
                )}

            </nav>

            {page === "login" && (
                <Login
                    onLogin={handleLogin}
                    onGoRegister={() => setPage("register")}
                />
            )}

            {page === "register" && (
                <Register
                    onRegister={() => setPage("login")}
                    onGoLogin={() => setPage("login")}
                />
            )}

            {page === "dashboard" && user && (
                <Dashboard />
            )}

            {page === "projects" && user && (
                <Projects
                    onOpenProject={openProject}
                />
            )}

            {page === "project-details" &&
                user &&
                selectedProjectId && (
                    <ProjectDetails
                        projectId={selectedProjectId}
                        onBack={() => setPage("projects")}
                    />
                )}

            {page === "matchmaker" && user && (
                <Matchmaker />
            )}

            {page === "ai-mentor" && user && (
                <AIMentor />
            )}

            {page === "feasibility" && user && (
                <Feasibility />
            )}

            {page === "my-analyses" && user && (
                <MyAnalyses
                    onOpenAnalysis={openAnalysis}
                />
            )}

            {page === "feasibility-details" &&
                user &&
                selectedAnalysisId && (
                    <FeasibilityDetails
                        analysisId={selectedAnalysisId}
                        onBack={() =>
                            setPage("my-analyses")
                        }
                    />
                )}

            {page === "home" && (
                <>
                    <main className="hero">

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
                                MENTORX helps students discover
                                projects, find compatible teammates
                                and turn ideas into achievable projects.
                            </p>

                            <div className="hero-buttons">

                                <button
                                    className="primary-btn"
                                    onClick={() =>
                                        openProtectedPage("projects")
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

                        </div>

                        <div className="robot-card">

                            <div className="robot">
                                🤖
                            </div>

                            <h2>
                                {user
                                    ? `Welcome, ${user.name}`
                                    : "MENTORX AI"}
                            </h2>

                            <p>
                                Your intelligent project companion.
                            </p>

                        </div>

                    </main>

                    <section className="features">

                        <div className="feature-card">
                            <h3>
                                🤝 Team Matchmaker
                            </h3>

                            <p>
                                Find teammates based on skills,
                                interests and experience.
                            </p>
                        </div>

                        <div className="feature-card">
                            <h3>
                                🚀 Projects
                            </h3>

                            <p>
                                Discover projects and join teams
                                that match your interests.
                            </p>
                        </div>

                        <div className="feature-card">
                            <h3>
                                🧠 Feasibility
                            </h3>

                            <p>
                                Check whether your project is
                                realistically achievable.
                            </p>
                        </div>

                    </section>
                </>
            )}

        </div>
    );
}

export default App;