import { useState } from "react";
import { apiUrl } from "./api";

function Register({ onRegister, onGoLogin }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        college: "",
        experienceLevel: "Beginner",
        skills: "",
        interests: "",
        preferredTechnologies: "",
        previousProjectTitle: "",
        previousProjectDescription: "",
        previousProjectTechnologies: "",
        previousProjectRole: "",
        currentTeamSize: 1,
        availableDevelopmentDays: 30,
        availableBudget: 10000,
        github: "",
        linkedin: "",
        availability: "Available",
        bio: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const previousProjects = [];

            if (form.previousProjectTitle.trim()) {
                previousProjects.push({
                    title: form.previousProjectTitle.trim(),
                    description:
                        form.previousProjectDescription.trim(),
                    technologies: form.previousProjectTechnologies
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    role: form.previousProjectRole.trim()
                });
            }

            const body = {
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                college: form.college.trim(),
                experienceLevel: form.experienceLevel,

                skills: form.skills
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),

                interests: form.interests
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),

                preferredTechnologies:
                    form.preferredTechnologies
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),

                previousProjects,

                currentTeamSize:
                    Number(form.currentTeamSize) || 1,

                availableDevelopmentDays:
                    Number(form.availableDevelopmentDays) || 0,

                availableBudget:
                    Number(form.availableBudget) || 0,

                github: form.github.trim(),
                linkedin: form.linkedin.trim(),
                availability: form.availability,
                bio: form.bio.trim()
            };

            const response = await fetch(
                apiUrl("/api/auth/register"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Registration failed"
                );
                return;
            }

            setMessage(
                "Account created successfully 🎉"
            );

            setTimeout(() => {
                if (onRegister) {
                    onRegister();
                }
            }, 700);

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            setMessage(
                "Cannot connect to MENTORX backend"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card register-card">

                <div className="auth-logo">
                    MENTORX
                </div>

                <h1>
                    Create account
                </h1>

                <p>
                    Build your profile so MENTORX can
                    personalize your project analysis.
                </p>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        minLength="6"
                        required
                    />

                    <input
                        type="text"
                        name="college"
                        placeholder="College"
                        value={form.college}
                        onChange={handleChange}
                    />

                    <select
                        name="experienceLevel"
                        value={form.experienceLevel}
                        onChange={handleChange}
                    >
                        <option value="Beginner">
                            Beginner
                        </option>

                        <option value="Intermediate">
                            Intermediate
                        </option>

                        <option value="Advanced">
                            Advanced
                        </option>
                    </select>

                    <textarea
                        name="bio"
                        placeholder="Short bio"
                        rows="3"
                        value={form.bio}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="skills"
                        placeholder="Skills: Python, React, MongoDB"
                        value={form.skills}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="interests"
                        placeholder="Interests: AI, Web Development"
                        value={form.interests}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="preferredTechnologies"
                        placeholder="Preferred tech: Python, React, Node.js"
                        value={form.preferredTechnologies}
                        onChange={handleChange}
                    />

                    <h3>
                        Previous Project
                    </h3>

                    <input
                        type="text"
                        name="previousProjectTitle"
                        placeholder="Previous project title"
                        value={form.previousProjectTitle}
                        onChange={handleChange}
                    />

                    <textarea
                        name="previousProjectDescription"
                        placeholder="Previous project description"
                        rows="3"
                        value={form.previousProjectDescription}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="previousProjectTechnologies"
                        placeholder="Technologies: React, Node.js, MongoDB"
                        value={
                            form.previousProjectTechnologies
                        }
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="previousProjectRole"
                        placeholder="Your role: Frontend Developer"
                        value={form.previousProjectRole}
                        onChange={handleChange}
                    />

                    <h3>
                        Your Resources
                    </h3>

                    <input
                        type="number"
                        name="currentTeamSize"
                        min="1"
                        placeholder="Current team size"
                        value={form.currentTeamSize}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="availableDevelopmentDays"
                        min="0"
                        placeholder="Available development days"
                        value={
                            form.availableDevelopmentDays
                        }
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="availableBudget"
                        min="0"
                        placeholder="Available budget"
                        value={form.availableBudget}
                        onChange={handleChange}
                    />

                    <select
                        name="availability"
                        value={form.availability}
                        onChange={handleChange}
                    >
                        <option value="Available">
                            Available
                        </option>

                        <option value="Part-time">
                            Part-time
                        </option>

                        <option value="Limited">
                            Limited
                        </option>
                    </select>

                    <input
                        type="url"
                        name="github"
                        placeholder="GitHub URL"
                        value={form.github}
                        onChange={handleChange}
                    />

                    <input
                        type="url"
                        name="linkedin"
                        placeholder="LinkedIn URL"
                        value={form.linkedin}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                {message && (
                    <div className="auth-message">
                        {message}
                    </div>
                )}

                <button
                    type="button"
                    className="switch-auth-btn"
                    onClick={onGoLogin}
                >
                    Already have an account? Login
                </button>

            </div>

        </div>
    );
}

export default Register;

