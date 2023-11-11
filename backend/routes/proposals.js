"use strict";

const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const proposalsController = require("../controllers/proposals");
const { isLoggedIn } = require("../controllers/authentication");

/* const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher")
    return res.status(401).json({ error: "Not authorized" });
  next();
} */

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
 * @returns { proposals: [ { id: number, title: string, description: string, author: string, ... } ] }
 * @error 401 Unauthorized - if the user is not logged in
 * @error 500 Internal Server Error - if something went wrong
 *
 * @see proposalsController.getProposals
 */
router.get("/", proposalsController.getAllProposals);

/**
   * POST /api/proposals
   *
   * @params none
   * @body { 
   *  title : string,
   *  supervisor_id : string,
   *  keywords : string[],
   *  type : string,
   *  groups : string[],
   *  description : string,
   *  required_knowledge : string,
   *  notes : string,
   *  expiration_date : string,
   *  level : string,
   *  cds_programmes : string[],
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
  // isTeacher,
  check("title").isString().notEmpty(),
  check("supervisor_id").isString().notEmpty(),
  check("keywords").isArray({ min: 1 }).custom(isArrayOfStrings), // can the keywords array be empty ??
  check("type").isString().notEmpty(),
  check("groups").optional().isArray({ min: 0 }).custom(isArrayOfStrings),
  check("description").isString(), // or .optional().isString() if it can be empty
  check("required_knowledge").isString().notEmpty(),
  check("notes").optional().isString(),
  check("expiration_date")
    .isDate()
    .isISO8601({ strict: true })
    .isLength({ min: 10, max: 10 }), // only YYYY-MM-DD
  check("level").isString().notEmpty(),
  check("cds_programmes").isArray({ min: 1 }).custom(isArrayOfStrings),
  validate,
  proposalsController.insertProposal
);

module.exports = router;
