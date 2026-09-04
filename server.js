const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const matchRoutes = require("./routes/matchRoutes");
const aiRoutes = require("./routes/aiRoutes");
const feasibilityRoutes = require("./routes/feasibilityRoutes");
const invitationRoutes = require("./routes/invitationRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/feasibility", feasibilityRoutes);
app.use("/api/invitations", invitationRoutes);

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
    res.json({
        message: "MENTORX Backend is Running 🚀"
    });
});

/* =========================
   MONGODB
========================= */

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(
            "MongoDB Connected Successfully ✅"
        );

        app.listen(PORT, () => {
            console.log(
                `MENTORX Backend running on http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB Connection Failed ❌"
        );

        console.error(
            error.message
        );
    });