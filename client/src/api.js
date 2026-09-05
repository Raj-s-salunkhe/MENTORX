const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "https://mentorx-api.vercel.app"
).replace(/\/$/, "");

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
