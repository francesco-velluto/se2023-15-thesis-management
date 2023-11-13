"use strict";

const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authentication');
const proposalsController = require('../controllers/proposals');


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
 * @returns { proposals: [ { proposal_id: string, title: string, description: string, supervisor_name: string, 
 *                              supervisor_surname: string, ... } ] }
 * @error 401 Unauthorized - if the user is not logged in
 * @error 500 Internal Server Error - if something went wrong
 *
 * @see proposalsController.getAllProposals
 */
router.get('/',authenticationController.isLoggedIn, proposalsController.getAllProposals);

/**
 * GET /api/proposals/:proposal_id
 *
 * @params proposal_id
 * @body none
 * @returns { supervisor_name: string, supervisor_surname: string, proposal_id: number, title: string, description: string, ... }
 * @error 401 Unauthorized - if the user is not logged in
 * @error 404 Not Found - if the proposal_id is not found
 * @error 500 Internal Server Error - if something went wrong
 */
router.get('/:proposal_id', authenticationController.isLoggedIn, proposalsController.getProposalById);

module.exports = router;

