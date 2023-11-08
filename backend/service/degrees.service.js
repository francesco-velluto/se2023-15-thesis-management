"use strict";

const db = require("./db");
const Degree = require("../model/Degree");

/**
 * Get all degrees from the database
 */
exports.getDegrees = async () => {
  try {
    const degrees = await db.query("SELECT * FROM degree");
    return degrees.rows.map(
      (row) => new Degree(row.cod_degree, row.title_degree)
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
