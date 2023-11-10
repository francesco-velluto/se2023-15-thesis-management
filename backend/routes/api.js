"use strict";

const express = require('express');
const router = express.Router();

/**
 * Main route for all the APIs
 * Here are imported all the routes of the APIs based on the resource
 */

const authentication = require('./authentication');
const proposals = require('./proposals');
const applications = require('./applications');

/**
 * Authentication routes
 * All the routes for the authentication
 * @see authentication.js
 *
 * Route /api/authentication
 */
router.use('/authentication', authentication);

/**
 * Proposals routes
 * All the routes for the proposals resources
 * @see proposals.js
 *
 * Route /api/proposals
 */
router.use('/proposals', proposals);

/**
 * Applications routes
 * All the routes for the applications resources
 * @see applications.js
 *
 * Route /api/applications
 */
router.use('/applications', applications);

module.exports = router;