import { useEffect, useState } from "react";
import { apiUrl } from "./api";

const REQUIRED_VERIFIED_SKILLS = 2;

const SKILL_CATEGORIES = {
    python: "backend",
    javascript: "backend",
    nodejs: "backend",
    java: "backend",
    cpp: "backend",
    react: "frontend",
    mongodb: "database"
};

function generateMatchReasons(match, project) {
    const reasons = [];
    const required = (project?.skillsRequired || [])
        .map((s) => String(s).toLowerCase().trim())
        .filter(Boolean);
    const recommended = (
        project?.recommendedTechnologies || []
    )
        .map((s) => String(s).toLowerCase().trim())
        .filter(Boolean);

    const assessments = match.skillAssessments || [];
    const verified = assessments.filter(
        (a) => a.confidence === "verified"
    );

    // 1) Strong verified skill matching project requirements
    const matchingVerified = verified
        .filter(
            (a) =>
                required.includes(
                    String(a.skill).toLowerCase().trim()
                ) ||
                recommended.includes(
                    String(a.skill).toLowerCase().trim()
                )
        )
        .sort((a, b) => b.proficiency - a.proficiency);

    if (matchingVerified.length > 0 && matchingVerified[0].proficiency >= 60) {
        reasons.push(
            `✓ Strong ${matchingVerified[0].skillName} proficiency`
        );
    }

    // 2) Fills a skill gap
    const candidateSkills = new Set([
        ...verified.map((a) =>
            String(a.skill).toLowerCase().trim()
        ),
        ...(match.selfReportedSkills || []).map((s) =>
            String(s).toLowerCase().trim()
        )
    ]);

    if (match.teamCompatibility >= 50 && required.length > 0) {
        const coveredRequired = required.filter((s) =>
            candidateSkills.has(s)
        );
        if (coveredRequired.length > 0) {
            const category =
                SKILL_CATEGORIES[coveredRequired[0]] ||
                "team";
            const areaLabel =
                category === "backend"
                    ? "backend"
                    : category === "frontend"
                    ? "frontend"
                    : category === "database"
                    ? "database"
                    : category === "design"
                    ? "design"
                    : "team";
            reasons.push(
                `✓ Fills a ${areaLabel} skill gap`
            );
        }
    }

    // 3) Strong project skill coverage
    if (match.skillCompatibility >= 60 && required.length > 0) {
        reasons.push("✓ Strong project skill coverage");
    }

    // 4) Good availability
    if (match.availabilityScore >= 70) {
        reasons.push("✓ Good availability");
    }

    // 5) Strong experience fit
    if (match.experienceCompatibility >= 75) {
        reasons.push("✓ Strong experience fit");
    }

    // Fallback
    if (reasons.length === 0 && match.teamMatch >= 40) {
        reasons.push("✓ Compatible team profile");
    }

    const unique = [...new Set(reasons)];
    return unique.slice(0, 4);
}

function Matchmaker({ onSkillVerification }) {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");

    const [matches, setMatches] = useState([]);

    const [receivedInvites, setReceivedInvites] = useState([]);

    // Sent invitations — tracks every invite the user has sent
    const [sentInvites, setSentInvites] = useState([]);

    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [loadingInvites, setLoadingInvites] = useState(true);
    const [loadingSentInvites, setLoadingSentInvites] = useState(true);

    const [inviteLoading, setInviteLoading] = useState({});
    const [inviteActionLoading, setInviteActionLoading] = useState({});

    const [message, setMessage] = useState("");
    const [inviteMessage, setInviteMessage] = useState("");

    // ── Skill-verification gate ──
    const [verifiedSkillCount, setVerifiedSkillCount] =
        useState(null);
    const [gateLoading, setGateLoading] = useState(true);

    const token = localStorage.getItem("token");

    const authHeaders = {
        Authorization: `Bearer ${token}`
    };

    /*
     * =========================================================
     * LOAD PROJECTS
     * =========================================================
     */

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const response = await fetch(
                    apiUrl("/api/projects"),
                    {
                        headers: authHeaders
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load projects"
                    );
                }

                setProjects(data.projects || []);
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoadingProjects(false);
            }
        };

        loadProjects();
    }, []);

    /*
     * =========================================================
     * LOAD VERIFICATION STATUS (ACCESS GATE)
     * =========================================================
     */

    const loadVerificationStatus = async () => {
        try {
            const response = await fetch(
                apiUrl("/api/match/verification-status"),
                { headers: authHeaders }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to load verification status"
                );
            }
            setVerifiedSkillCount(
                data.verifiedSkillCount || 0
            );
        } catch (error) {
            console.error(
                "Failed to load verification status:",
                error
            );
            setVerifiedSkillCount(0);
        } finally {
            setGateLoading(false);
        }
    };

    useEffect(() => {
        loadVerificationStatus();
    }, []);

    /*
     * =========================================================
     * LOAD RECEIVED INVITATIONS
     * =========================================================
     */

    const loadReceivedInvites = async () => {
        try {
            setLoadingInvites(true);

            const response = await fetch(
                apiUrl("/api/invitations/received"),
                {
                    headers: authHeaders
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load invitations"
                );
            }

            // Only show Pending invites in the notification center
            const all = data.invitations || data.received || [];
            setReceivedInvites(
                all.filter((inv) => inv.status === "Pending")
            );
        } catch (error) {
            console.error(
                "Failed to load invitations:",
                error
            );
        } finally {
            setLoadingInvites(false);
        }
    };

    /*
     * =========================================================
     * LOAD SENT INVITATIONS
     * =========================================================
     */

    const loadSentInvites = async () => {
        try {
            setLoadingSentInvites(true);

            const response = await fetch(
                apiUrl("/api/invitations/sent"),
                {
                    headers: authHeaders
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load sent invitations"
                );
            }

            setSentInvites(data.invitations || []);
        } catch (error) {
            console.error(
                "Failed to load sent invitations:",
                error
            );
        } finally {
            setLoadingSentInvites(false);
        }
    };

    useEffect(() => {
        loadReceivedInvites();
        loadSentInvites();
    }, []);

    /*
     * =========================================================
     * FIND MATCHES
     * =========================================================
     */

    const findMatches = async () => {
        if (!selectedProject) {
            setMessage("Please select a project first.");
            return;
        }

        try {
            setLoadingMatches(true);
            setMessage("");
            setMatches([]);

            const response = await fetch(
                apiUrl(`/api/match/${selectedProject}`),
                {
                    headers: authHeaders
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (data.requiresVerification) {
                    setVerifiedSkillCount(
                        data.verifiedSkillCount || 0
                    );
                    setMessage(data.message || "Skill verification required");
                    return;
                }
                throw new Error(
                    data.message || "Failed to find matches"
                );
            }

            setMatches(data.matches || []);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoadingMatches(false);
        }
    };

    /*
     * =========================================================
     * SEND INVITATION
     * =========================================================
     */

    const sendInvitation = async (match) => {
        const receiverId =
            match.user?.id ||
            match.user?._id;

        if (!selectedProject) {
            setMessage("Please select a project first.");
            return;
        }

        if (!receiverId) {
            setMessage("Unable to identify this teammate.");
            return;
        }

        try {
            setInviteLoading((previous) => ({
                ...previous,
                [receiverId]: true
            }));

            setMessage("");
            setInviteMessage("");

            const response = await fetch(
                apiUrl("/api/invitations"),
                {
                    method: "POST",
                    headers: {
                        ...authHeaders,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        projectId: selectedProject,
                        receiverId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                // Handle duplicate invitation gracefully
                if (
                    response.status === 400 &&
                    (data.message?.toLowerCase().includes("already") ||
                        data.message?.toLowerCase().includes("sent"))
                ) {
                    // Optimistically mark as sent so UI updates
                    setSentInvites((previous) => [
                        ...previous,
                        {
                            _id: `pending-${receiverId}-${selectedProject}`,
                            receiver: {
                                _id: receiverId,
                                name: match.user?.name || "Teammate"
                            },
                            project: {
                                _id: selectedProject,
                                title:
                                    projects.find(
                                        (p) => p._id === selectedProject
                                    )?.title || "Project"
                            },
                            status: "Pending"
                        }
                    ]);

                    setInviteMessage(
                        `Invitation already sent to ${
                            match.user?.name || "teammate"
                        }`
                    );
                    return;
                }

                throw new Error(
                    data.message || "Failed to send invitation"
                );
            }

            // Backend confirmed — add to sent invites from the response
            if (data.invitation) {
                setSentInvites((previous) => [
                    ...previous,
                    data.invitation
                ]);
            }

            setInviteMessage(
                `Invitation sent to ${
                    match.user?.name || "teammate"
                } ✅`
            );

        } catch (error) {
            setInviteMessage(
                error.message || "Failed to send invitation"
            );
        } finally {
            setInviteLoading((previous) => ({
                ...previous,
                [receiverId]: false
            }));
        }
    };

    /*
     * =========================================================
     * ACCEPT INVITATION
     * =========================================================
     */

    const acceptInvitation = async (invite) => {
        const invitationId =
            invite._id ||
            invite.id;

        if (!invitationId) {
            return;
        }

        try {
            setInviteActionLoading((previous) => ({
                ...previous,
                [invitationId]: "accept"
            }));

            const response = await fetch(
                apiUrl(
                    `/api/invitations/${invitationId}/accept`
                ),
                {
                    method: "POST",
                    headers: authHeaders
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to accept invitation"
                );
            }

            // Remove from received invites immediately
            setReceivedInvites((previous) =>
                previous.filter(
                    (item) =>
                        (item._id || item.id) !==
                        invitationId
                )
            );

            // Refresh sent invites so the sender's "Sent" card updates
            loadSentInvites();

            setMessage(
                `Invitation accepted! You've joined ${
                    invite.project?.title || "the project"
                } 🎉`
            );

        } catch (error) {
            setMessage(
                error.message || "Failed to accept invitation"
            );
        } finally {
            setInviteActionLoading((previous) => ({
                ...previous,
                [invitationId]: false
            }));
        }
    };

    /*
     * =========================================================
     * REJECT INVITATION
     * =========================================================
     */

    const rejectInvitation = async (invite) => {
        const invitationId =
            invite._id ||
            invite.id;

        if (!invitationId) {
            return;
        }

        try {
            setInviteActionLoading((previous) => ({
                ...previous,
                [invitationId]: "reject"
            }));

            const response = await fetch(
                apiUrl(
                    `/api/invitations/${invitationId}/reject`
                ),
                {
                    method: "POST",
                    headers: authHeaders
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to reject invitation"
                );
            }

            setReceivedInvites((previous) =>
                previous.filter(
                    (item) =>
                        (item._id || item.id) !==
                        invitationId
                )
            );

            setMessage("Invitation declined.");

        } catch (error) {
            setMessage(
                error.message || "Failed to reject invitation"
            );
        } finally {
            setInviteActionLoading((previous) => ({
                ...previous,
                [invitationId]: false
            }));
        }
    };

    /*
     * =========================================================
     * CANCEL SENT INVITATION
     * =========================================================
     */

    const cancelInvitation = async (sentInvite) => {
        const invitationId =
            sentInvite._id ||
            sentInvite.id;

        if (!invitationId) {
            return;
        }

        // Don't try to cancel optimistic (locally-added) invites
        if (String(invitationId).startsWith("pending-")) {
            setSentInvites((previous) =>
                previous.filter(
                    (item) =>
                        (item._id || item.id) !==
                        invitationId
                )
            );
            return;
        }

        try {
            setInviteLoading((previous) => ({
                ...previous,
                [invitationId]: true
            }));

            const response = await fetch(
                apiUrl(`/api/invitations/${invitationId}`),
                {
                    method: "DELETE",
                    headers: authHeaders
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to cancel invitation"
                );
            }

            setSentInvites((previous) =>
                previous.filter(
                    (item) =>
                        (item._id || item.id) !==
                        invitationId
                )
            );

            setInviteMessage("Invitation cancelled.");

        } catch (error) {
            setInviteMessage(
                error.message || "Failed to cancel invitation"
            );
        } finally {
            setInviteLoading((previous) => ({
                ...previous,
                [invitationId]: false
            }));
        }
    };

    /*
     * =========================================================
     * HELPERS
     * =========================================================
     */

    const getInviteUserName = (invite) => {
        return (
            invite.sender?.name ||
            invite.senderName ||
            invite.from?.name ||
            "MENTORX User"
        );
    };

    const getInviteProjectName = (invite) => {
        return (
            invite.project?.title ||
            invite.projectTitle ||
            "Project Invitation"
        );
    };

    const getInviteId = (invite) => {
        return (
            invite._id ||
            invite.id
        );
    };

    const getInviteReceiverId = (invite) => {
        return (
            invite.receiver?._id ||
            invite.receiver?.id ||
            invite.receiverId
        );
    };

    const getInviteProjectId = (invite) => {
        return (
            invite.project?._id ||
            invite.project?.id ||
            invite.projectId
        );
    };

    // Build a set of receiver IDs who have pending sent invites
    // for the currently selected project
    const getPendingReceiverIds = () => {
        if (!selectedProject) {
            return new Set();
        }

        return new Set(
            sentInvites
                .filter(
                    (inv) =>
                        inv.status === "Pending" &&
                        String(getInviteProjectId(inv)) ===
                            String(selectedProject)
                )
                .map((inv) => String(getInviteReceiverId(inv)))
        );
    };

    const pendingReceiverIds = getPendingReceiverIds();

    /*
     * =========================================================
     * UI
     * =========================================================
     */

    return (
        <div className="matchmaker-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="matchmaker-header">

                <p className="dashboard-tag">
                    MENTORX TEAM MATCHMAKER
                </p>

                <h1>
                    Find your
                    <span>
                        {" "}
                        perfect teammates.
                    </span>
                </h1>

                <p>
                    MENTORX compares verified skills,
                    team fit, interests and availability
                    to find compatible teammates.
                </p>

            </div>

            {verifiedSkillCount !== null && gateLoading === false && verifiedSkillCount < REQUIRED_VERIFIED_SKILLS && (
                <div className="matchmaker-gate">

                    <div className="gate-icon">🔒</div>

                    <h2>VERIFY YOUR SKILLS</h2>

                    <p>
                        Complete short skill assessments so MENTORX can match you with teammates based on your actual abilities.
                    </p>

                    <div className="gate-benefits">
                        <span>✓ More accurate teammate matches</span>
                        <span>✓ Better project compatibility</span>
                        <span>✓ Verified skill profile</span>
                    </div>

                    <button
                        className="verify-skills-btn"
                        onClick={() => onSkillVerification()}
                    >
                        VERIFY MY SKILLS
                    </button>

                </div>
            )}

            {/* =================================================
                INVITATION NOTIFICATION CENTER
            ================================================= */}

            <section className="invite-center">

                <div className="invite-center-header">

                    <div>
                        <p className="dashboard-tag">
                            TEAM INVITATIONS
                        </p>

                        <h2>
                            Your invitations
                        </h2>

                        <p>
                            Teammates who want to
                            collaborate with you.
                        </p>
                    </div>

                    <div className="invite-count">
                        {loadingInvites ? (
                            <span className="invite-count-loading" />
                        ) : (
                            receivedInvites.length
                        )}
                    </div>

                </div>

                {loadingInvites ? (
                    <div className="invite-loading">
                        Loading invitations...
                    </div>
                ) : receivedInvites.length === 0 ? (
                    <div className="invite-empty">
                        <div className="invite-empty-icon">
                            ✉️
                        </div>

                        <div>
                            <strong>
                                No pending invitations
                            </strong>

                            <span>
                                New team invitations will
                                appear here.
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="invite-list">

                        {receivedInvites.map(
                            (invite) => {
                                const invitationId =
                                    getInviteId(invite);

                                const action =
                                    inviteActionLoading[
                                        invitationId
                                    ];

                                return (
                                    <div
                                        className="invite-card"
                                        key={invitationId}
                                    >

                                        <div className="invite-person">

                                            <div className="invite-avatar">
                                                {getInviteUserName(
                                                    invite
                                                )
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ||
                                                    "U"}
                                            </div>

                                            <div>
                                                <strong>
                                                    {
                                                        getInviteUserName(
                                                            invite
                                                        )
                                                    }
                                                </strong>

                                                <span>
                                                    invited you to join
                                                    {" "}
                                                    <b>
                                                        {
                                                            getInviteProjectName(
                                                                invite
                                                            )
                                                        }
                                                    </b>
                                                </span>
                                            </div>

                                        </div>

                                        <div className="invite-actions">

                                            <button
                                                className="invite-accept-btn"
                                                onClick={() =>
                                                    acceptInvitation(
                                                        invite
                                                    )
                                                }
                                                disabled={Boolean(
                                                    action
                                                )}
                                            >
                                                {action === "accept"
                                                    ? "Accepting..."
                                                    : "Accept"}
                                            </button>

                                            <button
                                                className="invite-reject-btn"
                                                onClick={() =>
                                                    rejectInvitation(
                                                        invite
                                                    )
                                                }
                                                disabled={Boolean(
                                                    action
                                                )}
                                            >
                                                {action === "reject"
                                                    ? "Declining..."
                                                    : "Decline"}
                                            </button>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </section>

            {/* =================================================
                PROJECT SELECTOR
            ================================================= */}

            <div className="matchmaker-selector">

                <div>

                    <label>
                        Select a project
                    </label>

                    {loadingProjects ? (
                        <div className="match-loading">
                            Loading projects...
                        </div>
                    ) : (
                        <select
                            value={selectedProject}
                            onChange={(e) => {
                                setSelectedProject(
                                    e.target.value
                                );
                                setMessage("");
                                setInviteMessage("");
                            }}
                        >
                            <option value="">
                                Choose a project
                            </option>

                            {projects.map(
                                (project) => (
                                    <option
                                        key={project._id}
                                        value={project._id}
                                    >
                                        {project.title}
                                    </option>
                                )
                            )}
                        </select>
                    )}

                </div>

                <button
                    className="find-match-btn"
                    onClick={findMatches}
                    disabled={loadingMatches}
                >
                    {loadingMatches
                        ? "Finding Matches..."
                        : "Find Teammates →"}
                </button>

            </div>

            {/* =================================================
                SENT INVITATIONS SECTION
                (shown below project selector when matches load)
            ================================================= */}

            {!loadingMatches &&
                sentInvites.length > 0 && (
                    <section className="sent-invites-section">

                        <div className="sent-invites-heading">

                            <p className="dashboard-tag">
                                SENT INVITATIONS
                            </p>

                            <h2>
                                Invitations you've sent
                            </h2>

                        </div>

                        <div className="sent-invites-list">

                            {sentInvites
                                .filter(
                                    (inv) =>
                                        inv.status === "Pending"
                                )
                                .map((sent) => {
                                    const sentId =
                                        sent._id || sent.id;

                                    const isCancelling =
                                        Boolean(
                                            inviteLoading[sentId]
                                        );

                                    return (
                                        <div
                                            className="sent-invite-card"
                                            key={sentId}
                                        >
                                            <div className="sent-invite-info">
                                                <div className="sent-invite-avatar">
                                                    {(
                                                        sent.receiver?.name ||
                                                        sent.receiverName ||
                                                        "U"
                                                    )
                                                        ?.charAt(0)
                                                        ?.toUpperCase() ||
                                                        "U"}
                                                </div>
                                                <div>
                                                    <strong>
                                                        {sent.receiver?.name ||
                                                            sent.receiverName ||
                                                            "Teammate"}
                                                    </strong>
                                                    <span>
                                                        for{" "}
                                                        <b>
                                                            {sent.project?.title ||
                                                                sent.projectTitle ||
                                                                "Project"}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="sent-invite-status">
                                                <span className="sent-status-badge sent-status-pending">
                                                    Pending
                                                </span>

                                                <button
                                                    className="cancel-invite-btn"
                                                    onClick={() =>
                                                        cancelInvitation(
                                                            sent
                                                        )
                                                    }
                                                    disabled={isCancelling}
                                                    title="Cancel invitation"
                                                >
                                                    {isCancelling
                                                        ? "..."
                                                        : "✕"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                        </div>

                    </section>
                )}

            {/* =================================================
                MESSAGES
            ================================================= */}

            {message && (
                <div className="projects-message">
                    {message}
                </div>
            )}

            {inviteMessage && (
                <div className="invite-success-message">
                    {inviteMessage}
                </div>
            )}

            {/* =================================================
                MATCH LOADING
            ================================================= */}

            {loadingMatches && (
                <div className="match-loading-card">

                    <div className="loading-robot">
                        🤖
                    </div>

                    <h2>
                        MENTORX is analyzing candidates...
                    </h2>

                    <p>
                        Comparing skills, experience and
                        interests.
                    </p>

                </div>
            )}

            {/* =================================================
                MATCH RESULTS
            ================================================= */}

            {!loadingMatches &&
                matches.length > 0 && (
                    <div className="matches-section">

                        <div className="matches-heading">

                            <div>

                                <p className="dashboard-tag">
                                    MATCH RESULTS
                                </p>

                                <h2>
                                    Best Teammates
                                </h2>

                                <p>
                                    Ranked by compatibility
                                    score.
                                </p>

                            </div>

                            <div className="match-count">
                                {matches.length} matches
                            </div>

                        </div>

                        <div className="matches-grid">

                            {matches.map(
                                (match) => {
                                    const userId =
                                        match.user?.id ||
                                        match.user?._id;

                                    const isSending =
                                        Boolean(
                                            inviteLoading[
                                                userId
                                            ]
                                        );

                                    // Check if this user already has a pending
                                    // invite for the selected project
                                    const alreadySent =
                                        pendingReceiverIds.has(
                                            String(userId)
                                        );

                                    const showSentState =
                                        alreadySent || isSending;

                                    return (
                                        <div
                                            className="match-card"
                                            key={
                                                userId ||
                                                Math.random()
                                            }
                                        >
                                            {/* ---- CARD HEADER ---- */}
                                            <div className="match-card-header">

                                                <div className="match-user">

                                                    <div className="match-avatar">
                                                        {match.user.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase() ||
                                                            "U"}
                                                    </div>

                                                    <div>

                                                        <h3>
                                                            {
                                                                match.user
                                                                    .name
                                                            }
                                                        </h3>

                                                        <p>
                                                            {match.user
                                                                .college ||
                                                                "College not set"}
                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="match-teammate-fit">

                                                    <span className="fit-label">
                                                        TEAMMATE FIT
                                                    </span>

                                                    <span className="fit-text">
                                                        {(() => {
                                                            const safe = Number.isFinite(Number(match.teamMatch)) ? Number(match.teamMatch) : 0;
                                                            return safe >= 85
                                                                ? "Strong candidate for this project"
                                                                : safe >= 70
                                                                ? "Good candidate for this project"
                                                                : safe >= 50
                                                                ? "Potential candidate for this project"
                                                                : "Exploring fit";
                                                        })()}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* ---- SCORE BREAKDOWN ---- */}
                                            <div className="match-breakdown">

                                                <div>
                                                    <span>
                                                        Project Fit
                                                    </span>

                                                    <strong>
                                                        {match.projectCompatibility}%
                                                        <span className="breakdown-label">
                                                            (15%)
                                                        </span>
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        Skill Strength
                                                    </span>

                                                    <strong>
                                                        {match.skillCompatibility}%
                                                        <span className="breakdown-label">
                                                            (30%)
                                                        </span>
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        Team Gap Fill
                                                    </span>

                                                    <strong>
                                                        {match.teamCompatibility}%
                                                        <span className="breakdown-label">
                                                            (25%)
                                                        </span>
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        Availability
                                                    </span>

                                                    <strong>
                                                        {match.availabilityScore}%
                                                        <span className="breakdown-label">
                                                            (15%)
                                                        </span>
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        Experience Fit
                                                    </span>

                                                    <strong>
                                                        {match.experienceCompatibility}%
                                                        <span className="breakdown-label">
                                                            (15%)
                                                        </span>
                                                    </strong>
                                                </div>

                                            </div>

                                            {/* ---- WHY THIS MATCH? ---- */}
                                            <div className="match-reasons">

                                                <strong>WHY THIS MATCH?</strong>

                                                {generateMatchReasons(match, projects.find((p) => p._id === selectedProject)).map(
                                                    (reason, index) => (
                                                        <span
                                                            key={index}
                                                            className="reason-item"
                                                        >
                                                            {reason}
                                                        </span>
                                                    )
                                                )}

                                            </div>

                                            {/* ---- VERIFIED SKILLS ---- */}
                                            <div className="verified-skills-list">

                                                <strong>VERIFIED SKILLS</strong>

                                                {match.skillAssessments?.length > 0 &&
                                                    match.skillAssessments.map(
                                                        (assessment) => (
                                                            <span
                                                                key={
                                                                    assessment.skillName
                                                                }
                                                                className="verified-skill-row"
                                                            >
                                                                <span className="skill-name">
                                                                    {assessment.skillName}
                                                                </span>
                                                                <span className="skill-score">
                                                                    {Number(assessment.proficiency) || 0}%
                                                                    {assessment.confidence ===
                                                                        "verified" && (
                                                                        <span
                                                                            className="verified-badge"
                                                                            title={`Proficiency ${Number(
                                                                                assessment.proficiency
                                                                            ) || 0}%`}
                                                                        >
                                                                            ✓
                                                                        </span>
                                                                    )}
                                                                    {assessment.confidence ===
                                                                        "unverified" && (
                                                                        <span
                                                                            className="unverified-badge"
                                                                            title={`Unverified proficiency ${Number(
                                                                                assessment.proficiency
                                                                            ) || 0}%`}
                                                                        >
                                                                            ?
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </span>
                                                        )
                                                    )}

                                                {(!match.skillAssessments || match.skillAssessments.length === 0) && (
                                                    <span className="no-verified-skills">
                                                        No verified skills
                                                    </span>
                                                )}

                                            </div>

                                            {/* ---- INVITE BUTTON ---- */}
                                            <button
                                                className={`invite-btn ${
                                                    showSentState
                                                        ? "invite-btn-sent"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    sendInvitation(
                                                        match
                                                    )
                                                }
                                                disabled={
                                                    isSending ||
                                                    alreadySent
                                                }
                                            >
                                                {isSending
                                                    ? "Sending..."
                                                    : alreadySent
                                                    ? "Invitation Sent ✓"
                                                    : "Invite to Team →"}
                                            </button>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </div>
                )}

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {!loadingMatches &&
                selectedProject &&
                matches.length === 0 &&
                !message && (
                    <div className="empty-state">

                        <div>
                            🔍
                        </div>

                        <h2>
                            No matching users found
                        </h2>

                        <p>
                            Try another project or add
                            more users to MENTORX.
                        </p>

                    </div>
                )}

        </div>
    );
}

export default Matchmaker;
