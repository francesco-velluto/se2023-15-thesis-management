"use strict";

const express = require("express");
const router = express.Router();

/**
 * Main route for all the APIs
 * Here are imported all the routes of the APIs based on the resource
 */

const authentication = require("./authentication");
const proposals = require("./proposals");
const { getTeachers } = require("../controllers/teachers");
const { getDegrees } = require("../controllers/degrees");

/**
 * Authentication routes
 * All the routes for the authentication
 * @see authentication.js
 *
 * Route /api/authentication
 */
router.use("/authentication", authentication);

/**
 * Proposals routes
 * All the routes for the proposals resources
 * @see proposals.js
 *
 * Route /api/proposals
 */
router.use("/proposals", proposals);

// TO-DO: maybe move them to another file ??
router.get("/teachers", getTeachers);

router.get("/degrees", getDegrees);

module.exports = router;
