"use strict";

const express = require('express');
const router = express.Router();

/**
 * Main route for all the APIs
 * Here are imported all the routes of the APIs based on the resource
 */

const authentication = require('./authentication');
const proposals = require('./proposals');

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

module.exports = router;