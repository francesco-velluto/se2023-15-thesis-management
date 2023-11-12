"use strict";

const express = require('express');
const router = express.Router();

const proposalsController = require('../controllers/proposals');
const authenticationController = require('../controllers/authentication');

/**
 * Proposals API routes
 * All the routes for the proposals resources
 *
 * Route /api/proposals
 */

/**
 * GET /api/proposals
 *
 * @params none
 * @body none
 * @returns { proposals: [ { proposal_id: string, title: string, description: string, supervisor_id: string, ... } ] }
 * @error 401 Unauthorized - if the user is not logged in
 * @error 500 Internal Server Error - if something went wrong
 *
 * @see proposalsController.getProposals
 */
router.get('/',authenticationController.isLoggedIn, proposalsController.getAllProposals);

module.exports = router;

