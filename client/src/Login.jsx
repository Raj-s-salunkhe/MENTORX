import { useState } from "react";

function Login({ onLogin, onGoRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Login failed"
                );
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setMessage("Login successful 🎉");

            if (onLogin) {
                onLogin(data.user);
            }

        } catch (error) {
            console.error("Login error:", error);

            setMessage(
                "Cannot connect to MENTORX backend"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">
                    MENTORX
                </div>

                <h1>
                    Welcome back
                </h1>

                <p>
                    Login with your registered MENTORX account.
                </p>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
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
                    onClick={onGoRegister}
                >
                    Don't have an account? Create one
                </button>

            </div>

        </div>
    );
}

export default Login;