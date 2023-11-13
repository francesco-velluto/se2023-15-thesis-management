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
const { isLoggedIn } = require("../controllers/authentication");
const applications = require("../controllers/applications");

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

/**
 * GET /api/teachers
 * 
 * Retrieve the list of all teachers.
 * Authentication: Required
 *
 * @param {Object} res HTTP Response Object
 * response body contains an array of teachers
 * 
 * @error 401 - Not Authenticated
 * @error 500 - Internal Server Error
 *
 * See official documentation for more details
 */
router.get("/teachers", isLoggedIn, getTeachers);

/**
 * GET /api/degrees
 * 
 * Retrieve the list of all degrees.
 * Authentication: Required
 *
 * @param {Object} res HTTP Response Object
 * response body contains an array of degrees
 * 
 * @error 401 - Not Authenticated
 * @error 500 - Internal Server Error
 *
 * See official documentation for more details
 */
router.get("/degrees", isLoggedIn, getDegrees);

/**
 * Applications routes
 * All the routes for the applications resources
 * @see applications.js
 *
 * Route /api/applications
 */
//router.use('/applications', applications);

module.exports = router;
