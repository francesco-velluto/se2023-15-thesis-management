"use strict";

const db = require("./db");
const Degree = require("../model/Degree");

/**
 * Get the list of all degrees from the database
 *
 * @returns {Degree[]} Array of Degree objects
 *
 * @throws {Error} - If there was some error in the database.
 */
exports.getDegrees = async () => {
  try {
    const degrees = await db.query("SELECT cod_degree, title_degree FROM degree");
    return degrees.rows.map((row) => new Degree(row.cod_degree, row.title_degree));
  } catch (err) {
    throw err;
  }
};
