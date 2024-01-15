"use strict";

const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const proposalsController = require("../controllers/proposals");
const {
  isLoggedIn,
  isTeacher,
  isStudent,
} = require("../controllers/authentication");

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, path, value, nestedErrors }) => {
  return `${location}[${path}]: ${msg}`;
};

const validate = (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty())
    return res.status(422).json({ error: errors.array().join(", ") });
  next();
};

const isArrayOfStrings = (array) => {
  if (array.some((item) => typeof item !== "string")) {
    throw new Error("All items in the array must be strings");
  }
  return true;
};

/**
 * Proposals API routes
 * All the routes for the proposals resources
 *
 * Route /api/proposals
 */

/**
 * GET /api/proposals/requests
 *
 * @params none
 * @body none
 * @returns { proposal: { request_id: number, title: string, ... } }
 * @status 201 Success status
 * @error 401 Unauthorized - if the user is not logged in
 * @error 500 Internal Server Error - if something went wrong
 *
 * @note Refer to the official documentation for more details
 */
router.get(
  "/requests",
  isLoggedIn,
  isStudent,
  proposalsController.getThesisRequest
);

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
router.get("/", isLoggedIn, isStudent, proposalsController.getAllProposals);

/**
 * GET /api/proposals/professor/
 *
 * @params none
 * @body none
 * @returns { proposals: [ { proposal_id: string, title: string, description: string, supervisor_name: string,
 *                              supervisor_surname: string, ... } ] }
 * @error 401 Unauthorized - if the user is not logged in
 * @error 500 Internal Server Error - if something went wrong
 *
 * @see proposalsController.getAllProfessorProposals
 */
router.get(
  "/professor",
  isLoggedIn,
  isTeacher,
  proposalsController.getAllProfessorProposals
);

/**
 * POST /api/proposals
 *
 * @params none
 * @body {
 *  title : string,
 *  keywords : string[],
 *  type : string,
 *  groups : string[],
 *  description : string,
 *  required_knowledge : string,
 *  notes : string,
 *  expiration_date : string,
 *  level : string,
 *  programmes : string[],
 * }
 * @returns { proposal: { id: number, title: string, ... } }
 * @error 401 Unauthorized - if the user is not logged in
 * @error 422 Invalid body - invalid fields in request body
 * @error 500 Internal Server Error - if something went wrong
 *
 * Refer to the official documentation for more details
 */
router.post(
  "/",
  isLoggedIn,
  isTeacher,
  check("title").isString().notEmpty(),
  check("keywords").isArray({ min: 1 }).custom(isArrayOfStrings),
  check("type").isString().notEmpty(),
  check("description").isString(),
  check("required_knowledge").optional().isString(),
  check("notes").optional().isString(),
  check("expiration_date")
    .isDate()
    .isISO8601({ strict: true })
    .isLength({ min: 10, max: 10 }), // only YYYY-MM-DD
  check("level").isString().notEmpty(),
  check("programmes").isArray({ min: 1 }).custom(isArrayOfStrings),
  validate,
  proposalsController.insertProposal
);

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
router.get("/:proposal_id", isLoggedIn, proposalsController.getProposalById);

/**
 * PUT /api/proposals/:proposal_id
 *
 * @params none
 * @body {
 *  title : string,
 *  keywords : string[],
 *  type : string,
 *  groups : string[],
 *  description : string,
 *  required_knowledge : string,
 *  notes : string,
 *  expiration_date : string,
 *  level : string,
 *  programmes : string[],
 * }
 * @returns { proposal: { id: number, title: string, ... } }
 * @error 401 Unauthorized - if the user is not logged in
 * @error 403 Unauthorized - if the thesis proposal does not belong to the current logged in teacher
 * @error 422 Invalid body - invalid fields in request body
 * @error 500 Internal Server Error - if something went wrong
 *
 * Refer to the official documentation for more details
 */
router.put(
  "/:proposal_id",
  isLoggedIn,
  isTeacher,
  check("title").isString().notEmpty(),
  check("keywords").isArray({ min: 1 }).custom(isArrayOfStrings),
  check("type").isString().notEmpty(),
  check("description").isString(),
  check("required_knowledge").optional().isString(),
  check("notes").optional().isString(),
  check("expiration_date")
    .isDate()
    .isISO8601({ strict: true })
    .isLength({ min: 10, max: 10 }), // only YYYY-MM-DD
  check("level").isString().notEmpty(),
  check("programmes").isArray({ min: 1 }).custom(isArrayOfStrings),
  validate,
  proposalsController.updateProposal
);
/**
 * DELETE /api/proposals/:proposal_id
 *
 * @params proposal_id
 * @body none
 * @returns none -> status 204
 *
 * @error 401 Not authenticated or Unauthorized
 * @error 403 Proposal with accepted application, expired proposal
 * @error 404 Proposal not found
 * @error 500 Internal server error
 *
 *
 */
router.delete(
  "/:proposal_id",
  isLoggedIn,
  isTeacher,
  proposalsController.deleteProposal
);

/**
 * DELETE /api/proposals/:proposal_id/archive
 *
 * @params proposal_id
 * @body none
 * @returns none -> status 204
 *
 * @error 401 Not authenticated or Unauthorized
 * @error 403 Proposal with accepted application, expired proposal
 * @error 404 Proposal not found
 * @error 500 Internal server error
 *
 *
 */
router.delete(
  "/:proposal_id/archive",
  isLoggedIn,
  isTeacher,
  proposalsController.archiveProposal
);

/**
 * POST /api/proposals/requests
 *
 * @params none
 * @body {
 *  title : string,
 *  description : string,
 *  supervisor : string,
 * }
 * @returns { proposal: { request_id: number, title: string, ... } }
 * @status 201 Success status
 * @error 401 Unauthorized - if the user is not logged in
 * @error 403 Unauthorized - there is already a thesis request for the authenticated student
 * @error 404 Invalid teacher - teacher not found in the db
 * @error 422 Invalid body - invalid fields in request body
 * @error 500 Internal Server Error - if something went wrong
 *
 * @note Refer to the official documentation for more details
 */
router.post(
  "/requests",
  isLoggedIn,
  isStudent,
  check("title").isString().notEmpty(),
  check("description").isString().notEmpty(),
  check("supervisor").isString().notEmpty(),
  validate,
  proposalsController.insertThesisRequest
);

module.exports = router;
