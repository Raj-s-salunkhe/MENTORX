const express = require("express");

const {
    sendInvitation,
    getReceivedInvitations,
    getSentInvitations,
    acceptInvitation,
    rejectInvitation,
    cancelInvitation
} = require("../controllers/invitationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/*
========================================
SEND INVITATION
POST /api/invitations
========================================
*/

router.post(
    "/",
    protect,
    sendInvitation
);

/*
========================================
RECEIVED INVITATIONS
GET /api/invitations/received
========================================
*/

router.get(
    "/received",
    protect,
    getReceivedInvitations
);

/*
========================================
SENT INVITATIONS
GET /api/invitations/sent
========================================
*/

router.get(
    "/sent",
    protect,
    getSentInvitations
);

/*
========================================
ACCEPT INVITATION
POST /api/invitations/:id/accept
========================================
*/

router.post(
    "/:id/accept",
    protect,
    acceptInvitation
);

/*
========================================
REJECT INVITATION
POST /api/invitations/:id/reject
========================================
*/

router.post(
    "/:id/reject",
    protect,
    rejectInvitation
);

/*
========================================
CANCEL INVITATION
DELETE /api/invitations/:id
========================================
*/

router.delete(
    "/:id",
    protect,
    cancelInvitation
);

module.exports = router;