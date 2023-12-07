"use strict";

const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const authenticationController = require('../controllers/authentication');
const proposalsController = require("../controllers/proposals");
const { isLoggedIn, isTeacher } = require("../controllers/authentication");

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
router.get("/", authenticationController.isLoggedIn, authenticationController.isStudent, proposalsController.getAllProposals);

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
router.get("/professor", authenticationController.isLoggedIn, authenticationController.isTeacher, proposalsController.getAllProfessorProposals);

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
  check("keywords").isArray({ min: 1 }).custom(isArrayOfStrings), // can the keywords array be empty ??
  check("type").isString().notEmpty(),
  check("description").isString(), // or .optional().isString() if it can be empty
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
router.get('/:proposal_id', authenticationController.isLoggedIn, proposalsController.getProposalById);

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
router.delete('/:proposal_id', authenticationController.isLoggedIn, authenticationController.isTeacher,
                proposalsController.deleteProposal);


module.exports = router;
