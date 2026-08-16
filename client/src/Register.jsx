import { useState } from "react";

function Register({ onRegister, onGoLogin }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        college: "",
        experienceLevel: "Beginner",
        skills: "",
        interests: ""
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
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: form.name.trim(),
                        email: form.email.trim(),
                        password: form.password,
                        college: form.college.trim(),
                        experienceLevel: form.experienceLevel,
                        skills: form.skills
                            .split(",")
                            .map(skill => skill.trim())
                            .filter(Boolean),
                        interests: form.interests
                            .split(",")
                            .map(interest => interest.trim())
                            .filter(Boolean)
                    })
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

            setForm({
                name: "",
                email: "",
                password: "",
                college: "",
                experienceLevel: "Beginner",
                skills: "",
                interests: ""
            });

            if (onRegister) {
                setTimeout(() => {
                    onRegister();
                }, 700);
            }

        } catch (error) {
            console.error("Registration error:", error);

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
                    Join MENTORX and start building with the right team.
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

                    <input
                        type="text"
                        name="skills"
                        placeholder="Skills: Python, React, Java"
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