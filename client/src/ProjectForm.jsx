import { useState } from "react";
import { apiUrl } from "./api";

const splitList = (value) =>
    value.split(",").map((item) => item.trim()).filter(Boolean);

function ProjectForm({ project, onComplete, onCancel }) {
    const [form, setForm] = useState({
        title: project?.title || "",
        description: project?.description || "",
        category: project?.category || "General",
        difficulty: project?.difficulty || "Beginner",
        skillsRequired: project?.skillsRequired?.join(", ") || "",
        interestsRequired: project?.interestsRequired?.join(", ") || "",
        recommendedTechnologies: project?.recommendedTechnologies?.join(", ") || "",
        estimatedDays: project?.estimatedDays ?? 30,
        estimatedBudget: project?.estimatedBudget ?? 0,
        recommendedTeamSize: project?.recommendedTeamSize ?? 2
    });
    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const response = await fetch(apiUrl(project ? `/api/projects/${project._id}` : "/api/projects"), {
                method: project ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    ...form,
                    skillsRequired: splitList(form.skillsRequired),
                    interestsRequired: splitList(form.interestsRequired),
                    recommendedTechnologies: splitList(form.recommendedTechnologies),
                    estimatedDays: Number(form.estimatedDays),
                    estimatedBudget: Number(form.estimatedBudget),
                    recommendedTeamSize: Number(form.recommendedTeamSize)
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to save project");
            onComplete(data.project._id);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setSaving(false);
        }
    };

    const setField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

    return (
        <div className="auth-page">
            <div className="auth-card register-card">
                <div className="auth-logo">MENTORX</div>
                <h1>{project ? "Edit project" : "Create a project"}</h1>
                <p>Give potential teammates enough context to decide whether they are a good fit.</p>
                <form onSubmit={handleSubmit}>
                    <input name="title" placeholder="Project title" value={form.title} onChange={setField} required />
                    <textarea name="description" placeholder="Describe the problem, outcome, and core workflow" value={form.description} onChange={setField} rows="4" required />
                    <input name="category" placeholder="Category (for example, AI or Web Development)" value={form.category} onChange={setField} />
                    <select name="difficulty" value={form.difficulty} onChange={setField}>
                        <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                    </select>
                    <input name="skillsRequired" placeholder="Required skills: React, Node.js" value={form.skillsRequired} onChange={setField} />
                    <input name="interestsRequired" placeholder="Relevant interests: AI, Education" value={form.interestsRequired} onChange={setField} />
                    <input name="recommendedTechnologies" placeholder="Recommended technologies: MongoDB, Express" value={form.recommendedTechnologies} onChange={setField} />
                    <input name="estimatedDays" type="number" min="0" placeholder="Estimated days" value={form.estimatedDays} onChange={setField} />
                    <input name="estimatedBudget" type="number" min="0" placeholder="Estimated budget" value={form.estimatedBudget} onChange={setField} />
                    <input name="recommendedTeamSize" type="number" min="1" placeholder="Recommended team size" value={form.recommendedTeamSize} onChange={setField} />
                    <button type="submit" disabled={saving}>{saving ? "Saving..." : project ? "Save Changes" : "Create Project"}</button>
                </form>
                {message && <div className="auth-message">{message}</div>}
                <button type="button" className="switch-auth-btn" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export default ProjectForm;
