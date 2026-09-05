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


/* =========================================
   BASIC MIDDLEWARE
========================================= */

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());


/* =========================================
   DATABASE CONNECTION
========================================= */

let isConnected = false;

async function connectDatabase() {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;

    console.log("MongoDB Connected Successfully ✅");
}


/* =========================================
   DATABASE MIDDLEWARE
   Runs BEFORE API routes
========================================= */

app.use(async (req, res, next) => {
    try {
        await connectDatabase();
        next();
    } catch (error) {
        console.error(
            "MongoDB Connection Failed ❌",
            error.message
        );

        return res.status(500).json({
            message: "Database connection failed"
        });
    }
});


/* =========================================
   HEALTH CHECK
========================================= */

app.get("/", (req, res) => {
    res.json({
        message: "MENTORX Backend is Running 🚀"
    });
});


/* =========================================
   API ROUTES
========================================= */

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/feasibility", feasibilityRoutes);
app.use("/api/invitations", invitationRoutes);


/* =========================================
   LOCAL DEVELOPMENT
========================================= */

if (require.main === module) {
    connectDatabase()
        .then(() => {
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

            console.error(error.message);
        });
}


/* =========================================
   VERCEL
========================================= */

module.exports = app;